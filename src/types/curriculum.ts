export interface Topic {
  name: string;
  completed: boolean;
  ixlLink?: string;
}

export interface Practice {
  description: string;
  completed: boolean;
  ixlLink?: string;
}

export interface Week {
  id: number;
  title: string;
  topics: Topic[];
  practice: Practice[];
  completed: boolean;
}

export interface CurriculumWeek extends Week {
  description: string;
}

export const weeks: CurriculumWeek[] = [
  {
    id: 1,
    title: "Equations, Functions, and Transformations",
    description: "Understanding basic equations, function concepts, and graph transformations",
    topics: [
      { name: "Function notation and evaluation", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/evaluate-functions" },
      { name: "Domain and range", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/domain-and-range" },
      { name: "Parent functions and their graphs", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/find-values-using-function-graphs" },
      { name: "Transformations: shifts, stretches, and reflections", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/function-transformation-rules" },
      { name: "Composition of functions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/composition-of-functions" }
    ],
    practice: [
      { description: "Evaluate functions and find domain/range", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/complete-a-table-for-a-function-graph" },
      { description: "Graph transformed functions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/graph-a-function" },
      { description: "Compose functions and find inverse functions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/find-inverse-functions" }
    ],
    completed: false
  },
  {
    id: 2,
    title: "Linear & Absolute Value Functions; Inequalities and Systems",
    description: "Working with linear functions, absolute value, and systems of equations/inequalities",
    topics: [
      { name: "Linear functions and their graphs", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/graph-a-linear-function" },
      { name: "Absolute value functions and equations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-absolute-value-equations" },
      { name: "Systems of linear equations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-a-system-of-equations-by-graphing" },
      { name: "Linear and absolute value inequalities", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-absolute-value-inequalities" },
      { name: "Systems of inequalities", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-systems-of-linear-inequalities-by-graphing" }
    ],
    practice: [
      { description: "Solve absolute value equations and inequalities", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-absolute-value-equations-and-inequalities" },
      { description: "Graph systems of inequalities", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-systems-of-linear-inequalities" },
      { description: "Solve real-world systems of equations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-word-problems-using-systems-of-linear-equations" }
    ],
    completed: false
  },
  {
    id: 3,
    title: "Complex Numbers & Quadratic Equations",
    description: "Introduction to complex numbers and solving quadratic equations",
    topics: [
      { name: "Introduction to complex numbers", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/introduction-to-complex-numbers" },
      { name: "Operations with complex numbers", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/add-and-subtract-complex-numbers" },
      { name: "Solving quadratic equations by factoring", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-a-quadratic-equation-by-factoring" },
      { name: "Quadratic formula and complex solutions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-a-quadratic-equation-using-the-quadratic-formula" },
      { name: "Complete the square method", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/complete-the-square" }
    ],
    practice: [
      { description: "Perform complex number operations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/multiply-complex-numbers" },
      { description: "Solve quadratic equations using multiple methods", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-quadratic-equations" },
      { description: "Find complex solutions to quadratic equations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-quadratic-equations-with-complex-solutions" }
    ],
    completed: false
  },
  {
    id: 4,
    title: "Quadratic Functions & Polynomials",
    description: "Understanding quadratic functions and working with polynomials",
    topics: [
      { name: "Characteristics of quadratic functions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/characteristics-of-quadratic-functions" },
      { name: "Vertex form and standard form", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/convert-between-standard-and-vertex-form" },
      { name: "Polynomial operations and factoring", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/factor-polynomials" },
      { name: "Polynomial division and remainder theorem", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/divide-polynomials" },
      { name: "Zeros of polynomials", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/find-zeros-of-polynomials" }
    ],
    practice: [
      { description: "Graph quadratic functions and identify key features", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/graph-quadratic-functions" },
      { description: "Factor and solve polynomial equations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-polynomial-equations" },
      { description: "Apply polynomial theorems", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/polynomial-remainder-theorem" }
    ],
    completed: false
  },
  {
    id: 5,
    title: "Radical Expressions & Function Operations",
    description: "Working with radicals and performing operations on functions",
    topics: [
      { name: "Simplifying radical expressions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/simplify-radical-expressions" },
      { name: "Solving radical equations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-radical-equations" },
      { name: "Function operations (add, subtract, multiply, divide)", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/operations-with-functions" },
      { name: "Composition of functions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/composition-of-functions" },
      { name: "Inverse functions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/find-inverse-functions" }
    ],
    practice: [
      { description: "Simplify and solve radical expressions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/simplify-radical-expressions-with-variables" },
      { description: "Perform function operations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/add-subtract-multiply-and-divide-functions" },
      { description: "Find and verify inverse functions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/find-and-verify-inverse-functions" }
    ],
    completed: false
  },
  {
    id: 6,
    title: "Exponents and Logarithms",
    description: "Understanding exponential and logarithmic functions",
    topics: [
      { name: "Properties of exponents", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/properties-of-exponents" },
      { name: "Exponential functions and their graphs", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/graph-exponential-functions" },
      { name: "Introduction to logarithms", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/convert-between-exponential-and-logarithmic-form" },
      { name: "Logarithm properties", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/properties-of-logarithms" },
      { name: "Solving exponential and logarithmic equations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-exponential-equations" }
    ],
    practice: [
      { description: "Apply logarithm properties", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-logarithmic-equations" },
      { description: "Solve exponential equations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-exponential-equations-using-logarithms" },
      { description: "Model real-world exponential growth/decay", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/exponential-growth-and-decay-word-problems" }
    ],
    completed: false
  },
  {
    id: 7,
    title: "Rational Expressions & Functions; Conics Overview",
    description: "Working with rational expressions and introduction to conic sections",
    topics: [
      { name: "Rational expressions and functions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/simplify-rational-expressions" },
      { name: "Domain and asymptotes of rational functions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/find-asymptotes-of-rational-functions" },
      { name: "Solving rational equations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-rational-equations" },
      { name: "Introduction to parabolas", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/graph-parabolas" },
      { name: "Circles and their equations", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/write-equations-of-circles-in-standard-form" }
    ],
    practice: [
      { description: "Simplify rational expressions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/multiply-and-divide-rational-expressions" },
      { description: "Graph rational functions", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/graph-rational-functions" },
      { description: "Work with parabolas and circles", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/equations-of-circles" }
    ],
    completed: false
  },
  {
    id: 8,
    title: "Trigonometry, Sequences, and Review",
    description: "Introduction to trigonometry, sequences, probability, and comprehensive review",
    topics: [
      { name: "Basic trigonometric ratios", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/trigonometric-ratios" },
      { name: "Arithmetic and geometric sequences", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/arithmetic-sequences" },
      { name: "Basic probability concepts", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/probability-of-compound-events" },
      { name: "Review of key concepts", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/algebra-2-review" },
      { name: "Test preparation strategies", completed: false, ixlLink: "https://www.ixl.com/math/skill-plans/algebra-2-common-core" }
    ],
    practice: [
      { description: "Solve problems using trigonometric ratios", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/solve-trigonometric-equations" },
      { description: "Work with sequences and series", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/geometric-sequences" },
      { description: "Complete comprehensive review exercises", completed: false, ixlLink: "https://www.ixl.com/math/algebra-2/algebra-2-diagnostic" }
    ],
    completed: false
  }
]; 