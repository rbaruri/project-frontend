import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchModulesRequest } from "@/containers/Modules/moduleActions";
import { AppDispatch } from "@/redux/store";
import ModulesComponent from "@/components/common/Modules";
import { selectModules, selectModulesLoading, selectModulesError } from "@/containers/Modules/moduleSelectors";
import { LoadingState, ErrorState, EmptyState } from "./components";

const Modules: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const modules = useSelector(selectModules);
  const loading = useSelector(selectModulesLoading);
  const error = useSelector(selectModulesError);
  const [showQuiz, setShowQuiz] = React.useState(false);

  useEffect(() => {
    dispatch(fetchModulesRequest());
  }, [dispatch]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (modules.length === 0) return <EmptyState />;

  return (
    <ModulesComponent 
      module={modules[0]}
      showQuiz={showQuiz}
      hasQuiz={Boolean(modules[0]?.quiz?.length)}
      onQuizToggle={() => setShowQuiz(!showQuiz)}
    />
  );
};

export default Modules; 