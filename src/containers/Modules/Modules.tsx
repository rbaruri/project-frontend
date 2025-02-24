import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchModulesRequest } from "./moduleActions";
import { RootState, AppDispatch } from "../../redux/store";
import Modules from "../../components/ui/Modules";

const Module: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { modules, loading, error } = useSelector((state: RootState) => state.modules); //add selector in separate file and use it here
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    dispatch(fetchModulesRequest());
  }, [dispatch]);

  if (loading) return <p>Loading modules...</p>;
  if (error) return <p>Error: {error}</p>;
  if (modules.length === 0) return <p>No modules available</p>;

  return (
    <Modules 
      module={modules[0]}
      showQuiz={showQuiz}
      hasQuiz={Boolean(modules[0]?.quiz?.length)}
      onQuizToggle={() => setShowQuiz(!showQuiz)}
    />
  );
};

export default Module;
