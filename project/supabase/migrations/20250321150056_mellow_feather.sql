/*
  # Add Sample Data

  1. Sample Data
    - Create default educator profile
    - Add initial courses with various categories and difficulty levels
    - Set realistic metadata (duration, lessons, etc.)

  2. Changes
    - Create default educator user and profile
    - Add sample courses with known instructor ID
*/

-- Create default educator user and profile
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'instructor@example.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name, role)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'instructor@example.com',
  'John Doe',
  'educator'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (
  title,
  description,
  category,
  difficulty,
  instructor_id,
  thumbnail_url,
  duration_weeks,
  lesson_count,
  enrolled_count,
  rating,
  review_count
) VALUES
(
  'Web Development Fundamentals',
  'Learn the basics of web development including HTML, CSS, and JavaScript. Perfect for beginners looking to start their web development journey.',
  'web-development',
  'beginner',
  '00000000-0000-0000-0000-000000000000',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  8,
  24,
  156,
  4.7,
  89
),
(
  'Advanced Machine Learning',
  'Deep dive into advanced machine learning concepts including neural networks, deep learning, and natural language processing.',
  'ai-ml',
  'advanced',
  '00000000-0000-0000-0000-000000000000',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
  12,
  36,
  92,
  4.9,
  45
),
(
  'Mobile App Development with React Native',
  'Build cross-platform mobile applications using React Native. Learn to create beautiful, native apps for both iOS and Android.',
  'mobile-development',
  'intermediate',
  '00000000-0000-0000-0000-000000000000',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
  10,
  30,
  124,
  4.6,
  67
),
(
  'Data Science Essentials',
  'Master the fundamentals of data science including statistics, Python programming, and data visualization.',
  'data-science',
  'beginner',
  '00000000-0000-0000-0000-000000000000',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
  8,
  28,
  178,
  4.8,
  95
),
(
  'UI/UX Design Principles',
  'Learn modern design principles and create beautiful, user-friendly interfaces using industry-standard tools.',
  'design',
  'intermediate',
  '00000000-0000-0000-0000-000000000000',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5',
  6,
  18,
  145,
  4.5,
  72
);