import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchModulesRequest } from "./moduleActions";
import { AppDispatch } from "../../redux/store";
import Modules from "../ui/Modules";
import { selectModules, selectModulesLoading, selectModulesError } from "./moduleSelectors";

const Module: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const modules = useSelector(selectModules);
  const loading = useSelector(selectModulesLoading);
  const error = useSelector(selectModulesError);
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
