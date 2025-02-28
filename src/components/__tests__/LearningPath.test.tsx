import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LearningPath from "@/components/common/LearningPath";

const mockModules = [
  { id: "1", title: "Module 1", description: "Description 1" },
  { id: "2", title: "Module 2", description: "Description 2" },
];

const mockOnModuleClick = jest.fn();

describe("LearningPath Component", () => {
  test("renders course name and progress", () => {
    render(
      <LearningPath
        modules={mockModules}
        overallProgress={50}
        onModuleClick={mockOnModuleClick}
        courseName="Test Course"
      />
    );

    expect(screen.getByText("Test Course")).toBeInTheDocument();
    expect(screen.getByText("Your Learning Journey")).toBeInTheDocument();
    expect(screen.getByText("Overall Progress")).toBeInTheDocument();
    expect(screen.getByText("50%"))
      .toBeInTheDocument();
  });

  test("renders all modules", () => {
    render(
      <LearningPath
        modules={mockModules}
        overallProgress={50}
        onModuleClick={mockOnModuleClick}
        courseName="Test Course"
      />
    );

    expect(screen.getByText("Module 1")).toBeInTheDocument();
    expect(screen.getByText("Module 2")).toBeInTheDocument();
  });

  test("calls onModuleClick when a module is clicked", () => {
    render(
      <LearningPath
        modules={mockModules}
        overallProgress={50}
        onModuleClick={mockOnModuleClick}
        courseName="Test Course"
      />
    );

    const moduleElement = screen.getByText("Module 1");
    fireEvent.click(moduleElement);
    expect(mockOnModuleClick).toHaveBeenCalledWith(mockModules[0]);
  });
});
