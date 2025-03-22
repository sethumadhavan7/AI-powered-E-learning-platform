import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, FileText, Briefcase, Check, X, AlertTriangle,
  ChevronDown, ChevronUp, Search, Filter, Download, Calendar
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import { euclidean as similarity } from 'ml-distance-euclidean';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

// Set worker source path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Resume {
  id: string;
  candidate_name: string;
  email: string;
  content: string;
  skills: string[];
  experience: any[];
  education: any[];
  match_score: number;
  match_category: 'Strong Match' | 'Weak Match' | 'No Match';
  created_at: string;
}

interface JobDescription {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  created_at: string;
}

// Simple tokenizer function to replace natural.WordTokenizer
const tokenize = (text: string): string[] => {
  return text.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0);
};

// Simple TF-IDF implementation
class SimpleTfIdf {
  private documents: string[][] = [];

  addDocument(text: string) {
    this.documents.push(tokenize(text));
  }

  tf(term: string, doc: string[]) {
    return doc.filter(word => word === term).length / doc.length;
  }

  idf(term: string) {
    const docsWithTerm = this.documents.filter(doc => doc.includes(term)).length;
    return Math.log(this.documents.length / (docsWithTerm || 1));
  }

  vectorize(doc: string[], index: number): number[] {
    const terms = Array.from(new Set(this.documents.flat()));
    return terms.map(term => this.tf(term, doc) * this.idf(term));
  }

  listTerms(docIndex: number) {
    const doc = this.documents[docIndex];
    const terms = Array.from(new Set(this.documents.flat()));
    return terms.map(term => ({
      term,
      tfidf: this.tf(term, doc) * this.idf(term)
    }));
  }
}

const ResumeScreening = () => {
  const { user } = useAuthStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [filter, setFilter] = useState<'all' | 'strong' | 'weak' | 'none'>('all');

  useEffect(() => {
    fetchJobDescriptions();
    fetchResumes();
  }, []);

  const fetchJobDescriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('job_descriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobDescriptions(data || []);
    } catch (err) {
      setError('Failed to fetch job descriptions');
    }
  };

  const fetchResumes = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('match_score', { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (err) {
      setError('Failed to fetch resumes');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    setError(null);

    for (const file of acceptedFiles) {
      try {
        const content = await extractTextFromPDF(file);
        const skills = extractSkills(content);
        const experience = extractExperience(content);
        const education = extractEducation(content);
        
        const { data, error } = await supabase
          .from('resumes')
          .insert([
            {
              candidate_name: file.name.replace('.pdf', ''),
              content,
              skills,
              experience,
              education,
              uploaded_by: user?.id
            }
          ])
          .select()
          .single();

        if (error) throw error;
        
        if (selectedJob) {
          await updateMatchScore(data.id);
        }

        setResumes(prev => [...prev, data]);
      } catch (err) {
        setError(`Failed to process ${file.name}`);
      }
    }

    setLoading(false);
  }, [selectedJob]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + ' ';
    }

    return fullText;
  };

  const extractSkills = (text: string): string[] => {
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql',
      'machine learning', 'data analysis', 'project management'
    ];
    
    const tokens = tokenize(text);
    return commonSkills.filter(skill => 
      tokens.includes(skill) || text.toLowerCase().includes(skill)
    );
  };

  const extractExperience = (text: string): any[] => {
    // Simplified experience extraction
    const experienceSection = text.match(/experience:(.*?)education:/is);
    if (!experienceSection) return [];

    return [{
      title: 'Extracted Experience',
      description: experienceSection[1].trim()
    }];
  };

  const extractEducation = (text: string): any[] => {
    // Simplified education extraction
    const educationSection = text.match(/education:(.*?)$/is);
    if (!educationSection) return [];

    return [{
      degree: 'Extracted Education',
      description: educationSection[1].trim()
    }];
  };

  const updateMatchScore = async (resumeId: string) => {
    if (!selectedJob) return;

    const job = jobDescriptions.find(j => j.id === selectedJob);
    if (!job) return;

    const resume = resumes.find(r => r.id === resumeId);
    if (!resume) return;

    // Calculate match score using simple TF-IDF and cosine similarity
    const tfidf = new SimpleTfIdf();
    tfidf.addDocument(job.description);
    tfidf.addDocument(resume.content);

    const jobVector = tfidf.listTerms(0).map(item => item.tfidf);
    const resumeVector = tfidf.listTerms(1).map(item => item.tfidf);

    const score = similarity(jobVector, resumeVector);
    const category = score > 0.7 ? 'Strong Match' : score > 0.4 ? 'Weak Match' : 'No Match';

    await supabase
      .from('resumes')
      .update({ 
        match_score: score,
        match_category: category
      })
      .eq('id', resumeId);

    setResumes(prev => prev.map(r => 
      r.id === resumeId ? { ...r, match_score: score, match_category: category } : r
    ));
  };

  const addJobDescription = async () => {
    try {
      const { data, error } = await supabase
        .from('job_descriptions')
        .insert([
          {
            title: newJobTitle,
            description: newJobDescription,
            required_skills: extractSkills(newJobDescription),
            created_by: user?.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setJobDescriptions(prev => [...prev, data]);
      setShowJobForm(false);
      setNewJobTitle('');
      setNewJobDescription('');
    } catch (err) {
      setError('Failed to add job description');
    }
  };

  const filteredResumes = resumes.filter(resume => {
    if (filter === 'all') return true;
    if (filter === 'strong') return resume.match_category === 'Strong Match';
    if (filter === 'weak') return resume.match_category === 'Weak Match';
    if (filter === 'none') return resume.match_category === 'No Match';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-2">Resume Screening</h2>
        <p className="text-indigo-200">Upload and analyze resumes to find the best candidates</p>
      </div>

      {/* Job Description Section */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Job Descriptions</h3>
          <button
            onClick={() => setShowJobForm(!showJobForm)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
          >
            {showJobForm ? <X className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
            <span>{showJobForm ? 'Cancel' : 'Add Job'}</span>
          </button>
        </div>

        {showJobForm && (
          <div className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Job Title"
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              placeholder="Job Description"
              value={newJobDescription}
              onChange={(e) => setNewJobDescription(e.target.value)}
              className="w-full h-32 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={addJobDescription}
              className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
            >
              Save Job Description
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobDescriptions.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJob(job.id)}
              className={`p-4 rounded-xl border transition-colors ${
                selectedJob === job.id
                  ? 'bg-purple-500 border-purple-400 text-white'
                  : 'bg-white/5 border-white/20 text-indigo-200 hover:bg-white/10'
              }`}
            >
              <h4 className="font-semibold mb-2">{job.title}</h4>
              <p className="text-sm truncate">{job.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div
        {...getRootProps()}
        className={`bg-white/5 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/20'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
        <p className="text-white font-medium mb-2">
          {isDragActive ? 'Drop the files here' : 'Drag & drop resumes here'}
        </p>
        <p className="text-indigo-200 text-sm">or click to select files</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-indigo-200">
          <Filter className="w-4 h-4" />
          <span>Filter:</span>
        </div>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-indigo-200 hover:bg-white/10'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('strong')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'strong'
              ? 'bg-green-500 text-white'
              : 'bg-white/5 text-indigo-200 hover:bg-white/10'
          }`}
        >
          Strong Matches
        </button>
        <button
          onClick={() => setFilter('weak')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'weak'
              ? 'bg-yellow-500 text-white'
              : 'bg-white/5 text-indigo-200 hover:bg-white/10'
          }`}
        >
          Weak Matches
        </button>
        <button
          onClick={() => setFilter('none')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filter === 'none'
              ? 'bg-red-500 text-white'
              : 'bg-white/5 text-indigo-200 hover:bg-white/10'
          }`}
        >
          No Matches
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-indigo-200">Processing resumes...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {resume.candidate_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-indigo-200 mb-4">
                    {resume.email && (
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {resume.email}
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(resume.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl ${
                  resume.match_category === 'Strong Match'
                    ? 'bg-green-500/20 text-green-400'
                    : resume.match_category === 'Weak Match'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  <div className="flex items-center gap-2">
                    {resume.match_category === 'Strong Match' ? (
                      <Check className="w-4 h-4" />
                    ) : resume.match_category === 'Weak Match' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    <span>{resume.match_category}</span>
                  </div>
                  <div className="text-sm opacity-75">
                    {Math.round(resume.match_score * 100)}% Match
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/5 rounded-lg text-indigo-200 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={() => {/* Download resume */}}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-indigo-200 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </button>
                <button
                  onClick={() => {/* View full details */}}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
    </div>
  );
};

export default ResumeScreening;