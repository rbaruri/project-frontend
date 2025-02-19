import CoursesContainer from "../containers/Courses/Courses";

const Courses = () => {
  return (
    <>  
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Courses</h2>
        <CoursesContainer />
      </div>
    </>
  );
};

export default Courses;
