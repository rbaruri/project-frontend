import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Resource {
  id: string;
  title: string;
  url: string;
}

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctOption?: string;
}

interface Quiz {
  id: string;
  status: string;
  cutoffScore: number;
  questions: Question[];
}

interface ModuleData {
  title: string;
  resources: Resource[];
  quiz: Quiz;
  similarQuestions: Question[];
}

const ModuleDetails: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch(`/api/modules/${moduleId}`);
        if (!response.ok) throw new Error('Failed to fetch module details');
        const data = await response.json();
        setModuleData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load module details');
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!moduleData) return <div>No module data found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{moduleData.title}</h1>

      {/* Resources Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Learning Resources</h2>
        <div className="grid gap-4">
          {moduleData.resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              <h3 className="text-lg text-blue-600">{resource.title}</h3>
            </a>
          ))}
        </div>
      </section>

      {/* Quiz Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quiz</h2>
        <div className="bg-white p-6 rounded-lg border">
          <div className="mb-4">
            <p className="text-gray-600">Status: {moduleData.quiz.status}</p>
            <p className="text-gray-600">Cutoff Score: {moduleData.quiz.cutoffScore}%</p>
          </div>
          {moduleData.quiz.status === 'not_attempted' && (
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Start Quiz
            </button>
          )}
        </div>
      </section>

      {/* Similar Questions Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Practice Questions</h2>
        <div className="grid gap-4">
          {moduleData.similarQuestions.map((question) => (
            <div key={question.id} className="p-4 border rounded-lg">
              <p className="text-lg">{question.question}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ModuleDetails; 