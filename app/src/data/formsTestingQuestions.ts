import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

export const formsTestingQuestions: Question[] = [

  // =====================================================================
  // NEXT_FORMS_VALIDATION (8 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding
  {
    id: 'next-forms-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Assemble a Zod schema for a form and export its inferred TypeScript type. Put the email field before the password field.',
    correctOrder: [
      'const schema = z.object({',
      '  email: z.string().email(),',
      '  password: z.string().min(8),',
      '});',
      'type FormData = z.infer<typeof schema>;',
    ],
    distractorLines: [
      '  email: z.string.email(),',
      'type FormData = z.infer<schema>;',
    ],
    solution: `const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type FormData = z.infer<typeof schema>;`,
    explanation:
      'z.string() is a function call, so validators chain off the result — z.string().email(), not z.string.email(). z.infer needs the `typeof` operator because it derives the type from the schema VALUE, not from a type named "schema". Defining validation once and inferring the type keeps the two in sync.',
    hints: [
      'Validators chain off z.string() — it must be called with ()',
      'z.infer takes typeof the schema value',
      'One field per line inside z.object()',
    ],
    tags: ['zod', 'schema', 'z-infer', 'parsons'],
    concepts: ['forms-zod-schema'],
  },

  {
    id: 'next-forms-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the Zod field validators: one checks the string is a valid email address, the other enforces a minimum length.',
    template: `const schema = z.object({
  email: z.string().___("Invalid email"),
  name: z.string().___(2, "Too short"),
});`,
    blanks: ['email', 'min'],
    solution: `const schema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Too short"),
});`,
    explanation:
      'Each Zod validator takes an optional custom message as its last argument, which surfaces in the error output. .email() validates the address format; .min(n) enforces a minimum length on a string.',
    hints: [
      'The validator that checks address format',
      'The validator that enforces a lower bound on length',
    ],
    tags: ['zod', 'validation', 'cloze'],
    concepts: ['forms-zod-schema'],
  },

  {
    id: 'next-forms-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the useForm call: destructure the object that holds field-level validation errors, and supply the adapter that delegates validation to a Zod schema.',
    template: `const {
  register,
  handleSubmit,
  formState: { ___ },
} = useForm({ resolver: ___(schema) });`,
    blanks: ['errors', 'zodResolver'],
    solution: `const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({ resolver: zodResolver(schema) });`,
    explanation:
      'formState.errors holds the per-field error objects React Hook Form populates after validation. Passing resolver: zodResolver(schema) makes RHF delegate all validation to Zod instead of using inline register() rules, so the schema is the single source of truth.',
    hints: [
      'The formState property that holds field errors',
      'The adapter that bridges Zod to React Hook Form',
    ],
    tags: ['react-hook-form', 'zodResolver', 'cloze'],
    concepts: ['forms-rhf-controller', 'forms-zod-resolver'],
  },

  // 1. Coding (JSX): Basic React Hook Form — login form
  {
    id: 'next-forms-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Create a LoginForm component using React Hook Form. The form has two fields: email (required, must match email pattern) and password (required, minLength 8). Use useForm() to get register, handleSubmit, and formState.errors. Display validation errors below each input. On valid submit, call a prop onSubmit(data).',
    starterCode: `"use client";
import { useForm } from "react-hook-form";

function LoginForm({ onSubmit }) {
  // TODO: useForm, register fields, show errors
}`,
    testCases: [
      {
        input: 'LoginForm with useForm',
        expectedOutput: 'useForm with register, handleSubmit, formState errors',
        description: 'Should use useForm hook with register, handleSubmit, and formState.errors',
      },
    ],
    solution: `"use client";
import { useForm } from "react-hook-form";

function LoginForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && <span role="alert">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
        {errors.password && <span role="alert">{errors.password.message}</span>}
      </div>

      <button type="submit">Log In</button>
    </form>
  );
}`,
    explanation:
      'React Hook Form uses uncontrolled inputs via register() for performance — it does not re-render the whole form on every keystroke like controlled inputs would. The register function returns ref, onChange, onBlur, and name props that RHF uses to track the field. handleSubmit only calls your onSubmit if all validations pass. formState.errors is populated with field-specific error objects containing the message you defined in the validation rules.',
    hints: [
      'Destructure { register, handleSubmit, formState: { errors } } from useForm()',
      'Spread {...register("fieldName", validationRules)} on each input',
      'Wrap onSubmit with handleSubmit: onSubmit={handleSubmit(onSubmit)}',
    ],
    tags: ['react-hook-form', 'useForm', 'register', 'validation', 'forms'],
    concepts: ['forms-rhf-controller', 'forms-zod-schema', 'web-html-forms-a11y'],
  },

  // 2. Coding (TypeScript): Zod schema for registration form
  {
    id: 'next-forms-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Define a Zod schema for a registration form with these fields: email (must be a valid email), password (minimum 8 characters), confirmPassword (string), and name (minimum 2 characters). Add a .refine() at the schema level to check that password and confirmPassword match. Export the inferred TypeScript type as FormData.',
    starterCode: `import { z } from "zod";

// TODO: define registrationSchema with .refine()
// TODO: export type FormData = z.infer<typeof registrationSchema>`,
    testCases: [
      {
        input: 'Zod schema with refine',
        expectedOutput: 'z.object with .refine for password match',
        description: 'Should define schema with email, password, confirmPassword, name and refine',
      },
    ],
    solution: `import { z } from "zod";

export const registrationSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    name: z.string().min(2, "Name must be at least 2 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormData = z.infer<typeof registrationSchema>;`,
    explanation:
      'Zod schemas are composable and type-safe. z.object() defines the shape, and each field gets validators chained on z.string(). The .refine() method adds custom validation that runs after all field-level checks pass — it receives the full parsed data object so you can compare fields. The path option tells Zod which field to attach the error to, so the "Passwords do not match" error shows up on confirmPassword, not at the form level. z.infer<typeof schema> extracts the TypeScript type automatically, keeping your types and validation in sync.',
    hints: [
      'Use z.string().email() for email validation',
      '.refine() goes on the whole z.object(), not individual fields',
      'path: ["confirmPassword"] attaches the error to the right field',
    ],
    tags: ['zod', 'schema', 'refine', 'validation', 'typescript'],
    concepts: ['forms-zod-schema'],
  },

  // 3. Coding (JSX): Connect Zod to React Hook Form with zodResolver
  {
    id: 'next-forms-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Create a RegistrationForm component that connects a Zod schema to React Hook Form. Import the registrationSchema and FormData type (already defined elsewhere). Use zodResolver(registrationSchema) as the resolver in useForm<FormData>(). Render all four fields (name, email, password, confirmPassword) with error messages. On valid submit, call props.onSubmit(data).',
    starterCode: `"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, FormData } from "./schema";

function RegistrationForm({ onSubmit }) {
  // TODO: useForm with zodResolver, render form with errors
}`,
    testCases: [
      {
        input: 'zodResolver integration',
        expectedOutput: 'useForm with resolver: zodResolver(registrationSchema)',
        description: 'Should connect Zod schema to React Hook Form via zodResolver',
      },
    ],
    solution: `"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, FormData } from "./schema";

function RegistrationForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" {...register("name")} />
        {errors.name && <span role="alert">{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email && <span role="alert">{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register("password")} />
        {errors.password && <span role="alert">{errors.password.message}</span>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <span role="alert">{errors.confirmPassword.message}</span>
        )}
      </div>

      <button type="submit">Register</button>
    </form>
  );
}`,
    explanation:
      'zodResolver bridges Zod and React Hook Form by translating Zod validation errors into the format RHF expects. When you pass resolver: zodResolver(schema) to useForm, RHF delegates all validation to Zod instead of using its own built-in rules. This means you no longer pass validation options to register() — the schema is the single source of truth. The generic useForm<FormData> gives you type-safe register() calls (TypeScript will error if you register a field name that does not exist in the schema).',
    hints: [
      'Pass resolver: zodResolver(registrationSchema) to useForm options',
      'No need for validation rules in register() — Zod handles it all',
      'useForm<FormData> gives you autocomplete on field names',
    ],
    tags: ['zodResolver', 'react-hook-form', 'zod', 'forms', 'integration'],
    concepts: ['forms-zod-resolver', 'forms-rhf-controller', 'forms-zod-schema', 'web-html-forms-a11y'],
  },

  // 4. MC: What does zodResolver do? (correct answer index 0 → position a)
  {
    id: 'next-forms-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    question: 'What does zodResolver do when passed to React Hook Form\'s useForm({ resolver: zodResolver(schema) })?',
    options: [
      {
        id: 'a',
        text: 'It bridges Zod and React Hook Form — running the schema on submit/blur/change and translating Zod errors into the shape RHF expects in formState.errors',
        isCorrect: true,
      },
      {
        id: 'b',
        text: 'It converts the Zod schema into HTML5 validation attributes like required and minlength directly on the input elements',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'It replaces useForm\'s internal validation engine with Zod\'s own hooks, so you no longer call register() on your inputs at all',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'It only validates once, on final submission — it cannot be wired to run on blur or change events like RHF\'s built-in resolvers',
        isCorrect: false,
      },
    ],
    explanation:
      'zodResolver is an adapter function from @hookform/resolvers/zod. It takes your Zod schema and returns a resolver function that RHF calls whenever it needs to validate (on submit by default, but also on blur or change if you configure mode). The resolver runs schema.safeParse() on the form values and maps any Zod errors to the { fieldName: { message, type } } format that RHF uses for formState.errors. This lets you keep Zod as your single source of truth for validation while RHF handles the form state management.',
    hints: [
      'Think about what "resolver" means — it resolves validation from an external library',
      'RHF needs errors in a specific format, and zodResolver handles that translation',
    ],
    tags: ['zodResolver', 'react-hook-form', 'zod', 'validation'],
    concepts: ['forms-zod-resolver', 'forms-rhf-controller', 'forms-zod-schema'],
  },

  // 5. MC: Why use Zod? (correct answer index 1 → position b)
  {
    id: 'next-forms-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    question: 'Why use Zod for form validation instead of relying on HTML5 validation attributes or React Hook Form\'s built-in validate functions?',
    options: [
      {
        id: 'a',
        text: 'Zod is faster at runtime because it compiles schemas to native validation code',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Type inference — z.infer<typeof schema> gives you TypeScript types for free, it works on both client and server (Server Actions), and schemas are composable and reusable',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'Zod is required by Next.js and will not work without it',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'HTML5 validation cannot check required fields or email patterns',
        isCorrect: false,
      },
    ],
    explanation:
      'Zod\'s killer feature is z.infer<typeof schema> — you define your validation once and get the TypeScript type automatically, keeping types and validation in sync. HTML5 validation works client-side only and is easily bypassed. RHF\'s built-in validate works but does not give you types and cannot be reused on the server. Zod schemas can be shared between client forms and Server Actions, ensuring the same validation runs everywhere. Schemas are also composable — you can merge, extend, pick, and omit fields from existing schemas.',
    hints: [
      'Think about DRY — where else might you validate the same data?',
      'Consider what happens if your form type and validation rules drift apart',
    ],
    tags: ['zod', 'validation', 'typescript', 'type-inference'],
    concepts: ['forms-zod-schema'],
  },

  // 6. Coding (TypeScript): Server Action with Zod validation
  {
    id: 'next-forms-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Write a Next.js Server Action function called createUser that receives FormData from a form submission. Extract email, password, and name from the FormData. Validate them using a Zod schema with safeParse(). If validation fails, return { success: false, errors: parsed.error.flatten().fieldErrors }. If valid, simulate saving to a DB and return { success: true, data: parsed.data }. Remember the "use server" directive.',
    starterCode: `// Declare the "use server" directive and import z from "zod"
// Build a Zod userSchema requiring email(), password.min(8), name.min(2)
// Export async createUser(formData): read email/password/name from formData via .get(),
// call safeParse; on failure return { success: false, errors: parsed.error.flatten().fieldErrors }
// on success return { success: true, data: parsed.data }
`,
    testCases: [
      {
        input: 'Server Action with Zod safeParse',
        expectedOutput: 'safeParse with error handling and success return',
        description: 'Should use safeParse to validate and return structured errors or success',
      },
    ],
    solution: `"use server";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export async function createUser(formData: FormData) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
  };

  const parsed = userSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false as const,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Save to database
  // await db.user.create({ data: parsed.data });

  return { success: true as const, data: parsed.data };
}`,
    explanation:
      'Server Actions run on the server, so client-side validation can be bypassed — you must re-validate on the server. safeParse() returns a discriminated union: { success: true, data } or { success: false, error }. Unlike parse(), safeParse() never throws, which is critical in Server Actions where you want to return a structured error response instead of crashing. error.flatten().fieldErrors gives you a { fieldName: string[] } map that is easy to display in the form. The "use server" directive tells Next.js this function runs server-side only.',
    hints: [
      'Use formData.get("fieldName") to extract values',
      'safeParse returns { success, data } or { success, error } — never throws',
      'error.flatten().fieldErrors gives you { field: ["message"] }',
    ],
    tags: ['server-actions', 'zod', 'safeParse', 'validation', 'next.js'],
    concepts: ['next-server-actions', 'forms-zod-schema'],
  },

  // 7. MC: parse() vs safeParse() (correct answer index 2 → position c)
  {
    id: 'next-forms-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    question: 'What is the difference between schema.parse() and schema.safeParse() in Zod?',
    options: [
      {
        id: 'a',
        text: 'parse() is synchronous and safeParse() is asynchronous',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'parse() validates only the types while safeParse() also checks refinements',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'parse() throws a ZodError on validation failure, while safeParse() never throws — it returns { success: true, data } or { success: false, error } so you can handle errors gracefully',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'They are identical, safeParse is just an alias for parse',
        isCorrect: false,
      },
    ],
    explanation:
      'parse() throws a ZodError when validation fails, which is fine in contexts where you want to catch exceptions (like middleware). safeParse() returns a result object instead of throwing — this is preferred in Server Actions and API routes where you want to return structured error responses to the client. Both run the exact same validations (including refinements and transforms). Use safeParse() when you need to gracefully handle invalid data; use parse() when invalid data should be treated as an exceptional case.',
    hints: [
      'Think about try/catch vs result objects',
      'Which approach is better in a Server Action that needs to return errors?',
    ],
    tags: ['zod', 'parse', 'safeParse', 'error-handling'],
    concepts: ['forms-zod-schema', 'js-error-handling'],
  },

  // 8. MC: useFieldArray (correct answer index 3 → position d)
  {
    id: 'next-forms-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    question: 'When do you need React Hook Form\'s useFieldArray hook?',
    options: [
      {
        id: 'a',
        text: 'When you have more than 5 fields in a form and need to optimize rendering',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'When you want to use arrays as select option values',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'When you need to validate array fields like checkboxes',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'When you have dynamic form fields like "add another phone number" — it manages an array of fields with append, remove, and move operations while keeping form state in sync',
        isCorrect: true,
      },
    ],
    explanation:
      'useFieldArray is for dynamic lists of fields where the user can add or remove entries — like multiple phone numbers, addresses, or line items in an invoice. It returns { fields, append, remove, prepend, move, swap } and keeps everything synced with RHF\'s form state. Without it, you would need to manually manage an array in state, handle registration/unregistration of fields, and keep validation in sync — useFieldArray handles all of that automatically.',
    hints: [
      'Think about forms where the number of inputs is not fixed',
      'Consider a form where users can add multiple addresses',
    ],
    tags: ['react-hook-form', 'useFieldArray', 'dynamic-forms', 'forms'],
    concepts: ['forms-rhf-controller', 'web-html-forms-a11y'],
  },

  // 9. Cloze fade: .refine for cross-field checks (fades next-forms-2's cold coding)
  {
    id: 'next-forms-cloze-refine',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the schema-level check: the method chained after z.object() that runs custom cross-field validation, and the option that attaches its error to a specific field.',
    template: `const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).___((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  ___: ["confirmPassword"],
});`,
    blanks: ['refine', 'path'],
    solution: `const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});`,
    explanation:
      '.refine() runs after every field-level validator passes, and receives the whole parsed object — this is the only place you can compare two fields against each other. path tells Zod which field the error belongs to, so it surfaces next to confirmPassword instead of as a form-wide error.',
    hints: [
      'The method for custom validation across multiple fields',
      'The option that targets which field the error attaches to',
    ],
    tags: ['zod', 'refine', 'cross-field', 'cloze'],
    concepts: ['forms-zod-schema'],
  },

  // 10. Cloze: z.coerce for FormData strings
  {
    id: 'next-forms-cloze-coerce',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the schema: FormData.get() always returns a string, so age and birthDate need to be coerced into a number and a Date before Zod validates their type.',
    template: `const schema = z.object({
  age: z.coerce.___().min(0),
  birthDate: z.coerce.___(),
});`,
    blanks: ['number', 'date'],
    solution: `const schema = z.object({
  age: z.coerce.number().min(0),
  birthDate: z.coerce.date(),
});`,
    explanation:
      'z.coerce.number() runs Number(value) before validating, and z.coerce.date() runs new Date(value) — both convert the raw string FormData always hands you into the type the rest of the schema expects. Without coerce, "25" fails a plain z.number() check because it is a string, not a number.',
    hints: [
      'The coercion for a numeric field',
      'The coercion for a date field',
    ],
    tags: ['zod', 'z-coerce', 'formdata', 'cloze'],
    concepts: ['forms-zod-schema'],
  },

  // 11. MC: why z.coerce is needed for FormData
  {
    id: 'next-forms-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    question: 'A Server Action reads formData.get("age") and passes it to a Zod schema with `age: z.number().min(0)`. Validation fails even when the user typed "25". Why, and what fixes it?',
    options: [
      { id: 'a', text: 'formData.get() always returns a string (or File), never a number, so z.number() correctly rejects it - use z.coerce.number() instead, which runs Number(value) before checking the type', isCorrect: true },
      { id: 'b', text: 'z.number().min(0) is broken in Zod 3 for any positive input - use z.number().gte(0) instead', isCorrect: false },
      { id: 'c', text: 'Server Actions serialize all fields as booleans by default, so the schema must use z.boolean() first and cast it manually', isCorrect: false },
      { id: 'd', text: 'The form input needs type="number" in the HTML - once that is set, Zod will automatically treat the value as a number without any schema change', isCorrect: false },
    ],
    explanation: 'The native FormData API always returns strings (or File objects for file inputs) from .get(), regardless of the input\'s HTML type attribute - "25" is a string, not a number, even from a <input type="number">. A plain z.number() schema correctly rejects it as a type mismatch. z.coerce.number() fixes this by running Number(value) first, then validating the result as a number - this is exactly the gap FormData-backed Server Actions need to bridge.',
    hints: [
      'Check what formData.get() actually returns, not what the input\'s HTML type suggests',
      'z.coerce runs a JS conversion before the type check',
    ],
    tags: ['zod', 'z-coerce', 'formdata', 'server-actions'],
    concepts: ['forms-zod-schema'],
  },

  // 12. Cloze: z.enum + optional fields
  {
    id: 'next-forms-cloze-enum',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the schema: role must be one of a fixed set of strings, and bio is allowed to be left out entirely.',
    template: `const schema = z.object({
  role: z.___(["admin", "editor", "viewer"]),
  bio: z.string().___(),
});`,
    blanks: ['enum', 'optional'],
    solution: `const schema = z.object({
  role: z.enum(["admin", "editor", "viewer"]),
  bio: z.string().optional(),
});`,
    explanation:
      'z.enum takes an array of allowed string literals - anything else fails validation, and z.infer gives you a union type ("admin" | "editor" | "viewer") for free. .optional() marks a field as allowed to be undefined, distinct from .nullable() (which allows null) - use both together (.optional().nullable()) if a field can be missing or explicitly null.',
    hints: [
      'The schema for a fixed set of allowed string values',
      'The modifier that allows a field to be left out entirely',
    ],
    tags: ['zod', 'z-enum', 'optional', 'cloze'],
    concepts: ['forms-zod-schema'],
  },

  // 13. Cloze: schema composition .extend/.pick/.omit
  {
    id: 'next-forms-cloze-composition',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the derived schemas: one adds an id field to the base schema, the other builds an edit-form schema using only the name and email fields.',
    template: `const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const userWithIdSchema = userSchema.___({ id: z.number() });

const editUserSchema = userSchema.___({ name: true, email: true });`,
    blanks: ['extend', 'pick'],
    solution: `const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const userWithIdSchema = userSchema.extend({ id: z.number() });

const editUserSchema = userSchema.pick({ name: true, email: true });`,
    explanation:
      '.extend() returns a new schema with additional fields merged in - useful for adding server-generated fields like id on top of a client-submitted shape. .pick() keeps only the named fields (the inverse, .omit(), drops named fields instead) - this mirrors TypeScript\'s Pick<T, K> and Omit<T, K> utility types, letting one base schema drive several narrower forms without duplicating validators.',
    hints: [
      'The method that adds new fields on top of an existing schema',
      'The method that keeps only the listed fields',
    ],
    tags: ['zod', 'schema-composition', 'extend', 'pick', 'cloze'],
    concepts: ['forms-zod-schema'],
  },

  // 14. MC: RHF defaultValues for edit forms
  {
    id: 'next-forms-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    question: 'You build an EditProfileForm with `useForm()` (no defaultValues) and manually set each input\'s `value` prop from the fetched user record. On first render, React logs a warning about switching an input from uncontrolled to controlled, and typing feels laggy. What is the fix?',
    options: [
      { id: 'a', text: 'Switch every input from register() to plain React state (useState) instead, since useForm has no built-in way to handle data that is not already available when the component first mounts', isCorrect: false },
      { id: 'b', text: 'The warning is unrelated to the form at all - it only means the fetched user record happened to arrive slightly after the component\'s first render, which is normal for any async fetch and requires no fix', isCorrect: false },
      { id: 'c', text: 'Pass the fetched data as `useForm({ defaultValues: user })` - React Hook Form seeds every registered field from it on mount, so inputs start controlled by RHF from the first render instead of you fighting it with a manual `value` prop', isCorrect: true },
      { id: 'd', text: 'Add `key={user.id}` to each input so React remounts them fresh on every keystroke, which resets the uncontrolled/controlled mismatch each time the input value changes', isCorrect: false },
    ],
    explanation: 'register() wires inputs as uncontrolled (RHF reads via refs), so manually also passing a `value` prop fights that setup and triggers React\'s uncontrolled-to-controlled warning as data arrives asynchronously. `defaultValues` is RHF\'s built-in way to seed initial values - pass the fetched record once and RHF applies it to every matching registered field on mount, which is exactly why edit forms (unlike blank create forms) need it.',
    hints: [
      'register() already manages the input - a manual value prop competes with it',
      'RHF has a config option specifically for seeding initial field values',
    ],
    tags: ['react-hook-form', 'defaultValues', 'edit-forms', 'controlled-inputs'],
    concepts: ['forms-rhf-controller'],
  },

  // 15. Cloze: watch / reset
  {
    id: 'next-forms-cloze-watch',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the form: one call subscribes to a field\'s live value for a character counter, the other clears the whole form back to defaultValues after a successful submit.',
    template: `const { register, handleSubmit, ___, reset } = useForm();
const bio = ___("bio");

const onSubmit = async (data) => {
  await saveProfile(data);
  ___();
};`,
    blanks: ['watch', 'watch', 'reset'],
    solution: `const { register, handleSubmit, watch, reset } = useForm();
const bio = watch("bio");

const onSubmit = async (data) => {
  await saveProfile(data);
  reset();
};`,
    explanation:
      'watch("fieldName") subscribes the component to that field\'s live value, re-rendering as the user types - perfect for a character counter or a live preview. reset() with no arguments restores the form to its original defaultValues, which is the standard way to clear a form after a successful submit without a manual page reload.',
    hints: [
      'The function that subscribes to a field\'s current value',
      'The function that clears the form back to its defaults',
    ],
    tags: ['react-hook-form', 'watch', 'reset', 'cloze'],
    concepts: ['forms-rhf-controller'],
  },

  // 16. Coding: reset-after-submit using watch + reset
  {
    id: 'next-forms-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Build a CommentForm component using React Hook Form.\n\nRequirements:\n- Register a single "comment" textarea field\n- Use watch("comment") to show a live character count below the textarea, e.g. "42/280"\n- On valid submit, call an async prop postComment(data), then call reset() to clear the form back to empty\n- Disable the submit button while comment is empty (use watch to check its length)',
    starterCode: `"use client";
import { useForm } from "react-hook-form";

function CommentForm({ postComment }) {
  // TODO: register, watch for live count, reset after submit
}`,
    testCases: [
      {
        input: 'watch + reset wiring',
        expectedOutput: 'watch("comment") for live count, handleSubmit calls postComment then reset()',
        description: 'Should show a live character count via watch and clear the form via reset after submit',
      },
    ],
    solution: `"use client";
import { useForm } from "react-hook-form";

function CommentForm({ postComment }) {
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: { comment: "" },
  });

  const comment = watch("comment");

  const onSubmit = async (data) => {
    await postComment(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea {...register("comment")} maxLength={280} />
      <span>{comment.length}/280</span>
      <button type="submit" disabled={comment.length === 0}>
        Post
      </button>
    </form>
  );
}`,
    explanation:
      'watch("comment") re-renders the component with the field\'s current value on every keystroke, which is exactly what a live character counter needs - register() alone would not expose that value to the render without it. Calling reset() inside onSubmit after the async postComment resolves restores every field to defaultValues (here, an empty string), clearing the textarea without a manual state reset or page reload.',
    hints: [
      'watch("fieldName") returns the current value and subscribes to updates',
      'reset() with no args goes back to defaultValues',
      'Call reset() after the async submit succeeds, inside onSubmit',
    ],
    tags: ['react-hook-form', 'watch', 'reset', 'forms'],
    concepts: ['forms-rhf-controller'],
  },

  // 17. Cloze: Controller for non-native inputs
  {
    id: 'next-forms-cloze-controller',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the wiring for a third-party Select component that does not accept a ref: the component that bridges it to React Hook Form, and the render-prop function that hands back field props to spread onto it.',
    template: `<___
  name="country"
  control={control}
  ___={({ field }) => (
    <CustomSelect value={field.value} onChange={field.onChange} />
  )}
/>`,
    blanks: ['Controller', 'render'],
    solution: `<Controller
  name="country"
  control={control}
  render={({ field }) => (
    <CustomSelect value={field.value} onChange={field.onChange} />
  )}
/>`,
    explanation:
      'register() assumes the input exposes a native ref, onChange, and onBlur - most UI-library components (custom selects, date pickers, sliders) do not. Controller subscribes that kind of component to RHF instead, and its render prop hands you a `field` object ({ value, onChange, onBlur, ref }) that you manually wire onto whatever props the custom component actually accepts.',
    hints: [
      'The component that bridges a non-native input to React Hook Form',
      'The prop that receives the field object as a render function',
    ],
    tags: ['react-hook-form', 'Controller', 'render-prop', 'cloze'],
    concepts: ['forms-rhf-controller', 'pattern-render-props'],
  },

  // 18. MC: Controller for non-native inputs concept
  {
    id: 'next-forms-12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    question: 'You wire a UI library\'s `<CustomSelect>` into a form with `{...register("country")}`, the same way you register plain `<input>` elements. It silently fails to update form state when the user picks an option. Why, and what is the fix?',
    options: [
      { id: 'a', text: 'CustomSelect must be rewritten from scratch as a native <select> element before it can participate in any React Hook Form project at all - third-party UI-library components can never be wired into RHF, whether through register() or any other API, since RHF only understands elements the browser itself renders natively', isCorrect: false },
      { id: 'b', text: 'register() only works inside <form> elements whose method attribute is explicitly set to "post" rather than left as the default "get" - switching CustomSelect\'s parent form to method="post" restores the connection between the component and RHF\'s internal field registry', isCorrect: false },
      { id: 'c', text: 'This is expected behavior, not a bug - React Hook Form only tracks one registered field per form at any given time, and country happens to collide with an earlier field registration that silently wins and swallows every subsequent one', isCorrect: false },
      { id: 'd', text: 'register() attaches a native DOM ref and listens for the native onChange/onBlur events of an <input> or <select> - CustomSelect is a React component with its own custom props (value/onChange, or something else entirely), so spreading register\'s ref onto it does not hook into anything RHF can observe. Use <Controller name="country" control={control} render={...}> instead, wiring field.value/field.onChange onto CustomSelect\'s own prop names', isCorrect: true },
    ],
    explanation: 'register() is built around native form elements: it forwards a ref RHF uses to read the DOM value directly, plus native onChange/onBlur handlers. A component like CustomSelect almost never exposes that same contract - it manages its own internal state and calls whatever prop names it defines (which may not even be called onChange). Controller is the escape hatch: it does not rely on native DOM behavior at all, instead handing you a `field` object through its render prop that you manually map onto the custom component\'s actual API.',
    hints: [
      'Think about what register() actually needs from the element it is spread onto',
      'Controller does not assume any particular native DOM contract',
    ],
    tags: ['react-hook-form', 'Controller', 'register', 'ui-library-integration'],
    concepts: ['forms-rhf-controller'],
  },

  // =====================================================================
  // NEXT_TESTING (15 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding
  {
    id: 'next-testing-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Assemble a React Testing Library test that a Button calls its onClick handler when clicked. Arrange the lines in this order: create the mock, render, fire the click, then assert.',
    correctOrder: [
      'it("calls onClick when clicked", () => {',
      '  const handleClick = jest.fn();',
      '  render(<Button onClick={handleClick}>Click me</Button>);',
      '  fireEvent.click(screen.getByRole("button"));',
      '  expect(handleClick).toHaveBeenCalled();',
      '});',
    ],
    distractorLines: [
      '  const handleClick = jest.mock();',
      '  fireEvent.press(screen.getByRole("button"));',
    ],
    solution: `it("calls onClick when clicked", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByRole("button"));
  expect(handleClick).toHaveBeenCalled();
});`,
    explanation:
      'jest.fn() creates a spy you can assert on — jest.mock() is for replacing whole modules, not making a callback. fireEvent.click simulates a DOM click (there is no fireEvent.press in RTL). getByRole("button") finds the element the way a user or screen reader would. You must render before you can query or fire events.',
    hints: [
      'jest.fn() makes a spy; jest.mock() replaces a module',
      'RTL uses fireEvent.click, not press',
      'Render first, then query, then assert',
    ],
    tags: ['jest', 'react-testing-library', 'fireEvent', 'parsons'],
    concepts: ['testing-rtl-queries'],
  },

  {
    id: 'next-testing-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the test: query the button by its accessible role, then simulate a click on it.',
    template: `render(<Button>Submit</Button>);
const button = screen.___("button", { name: "Submit" });
fireEvent.___(button);`,
    blanks: ['getByRole', 'click'],
    solution: `render(<Button>Submit</Button>);
const button = screen.getByRole("button", { name: "Submit" });
fireEvent.click(button);`,
    explanation:
      'getByRole is RTL\'s recommended query — it finds elements by their ARIA role and accessible name, mirroring how assistive tech navigates. fireEvent.click dispatches a click event on the resolved element.',
    hints: [
      'The query that finds an element by ARIA role',
      'The fireEvent method for a mouse click',
    ],
    tags: ['react-testing-library', 'getByRole', 'cloze'],
    concepts: ['testing-rtl-queries'],
  },

  {
    id: 'next-testing-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the test: create a mock handler, then assert that it ran after the click.',
    template: `const handleClick = jest.___();
render(<Button onClick={handleClick}>Go</Button>);
fireEvent.click(screen.getByRole("button"));
expect(handleClick).___();`,
    blanks: ['fn', 'toHaveBeenCalled'],
    solution: `const handleClick = jest.fn();
render(<Button onClick={handleClick}>Go</Button>);
fireEvent.click(screen.getByRole("button"));
expect(handleClick).toHaveBeenCalled();`,
    explanation:
      'jest.fn() returns a mock function that records every call. After firing the click, toHaveBeenCalled() asserts the spy ran at least once — use toHaveBeenCalledTimes(n) when the exact count matters.',
    hints: [
      'The Jest factory for a spy function',
      'The matcher that checks a spy was invoked',
    ],
    tags: ['jest', 'mock', 'cloze'],
    concepts: ['testing-rtl-queries'],
  },

  // 1. Coding (JSX): Jest + RTL test for Button component
  {
    id: 'next-testing-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Write a Jest + React Testing Library test for a Button component. The Button accepts props: children (string), onClick (function), and disabled (boolean). Write three tests: 1) renders with the correct text, 2) calls onClick when clicked, 3) does not call onClick when disabled. Use render, screen, fireEvent, and jest.fn().',
    starterCode: `import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  // TODO: write three tests
});`,
    testCases: [
      {
        input: 'Button tests with RTL',
        expectedOutput: 'render, screen.getByRole, fireEvent.click, jest.fn, expect',
        description: 'Should test rendering, click handling, and disabled state',
      },
    ],
    solution: `import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with the correct text", () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});`,
    explanation:
      'React Testing Library encourages testing from the user\'s perspective. screen.getByRole("button") finds elements the way a user or screen reader would — by their accessible role. jest.fn() creates a mock function that tracks calls, so you can assert it was called (or not). fireEvent.click simulates a real click event. Testing the disabled state ensures your component correctly prevents interaction, which is important for accessibility and UX.',
    hints: [
      'Use screen.getByRole("button", { name: "text" }) to find buttons accessibly',
      'jest.fn() creates a spy you can assert on with toHaveBeenCalled()',
      'Disabled buttons should not fire click handlers',
    ],
    tags: ['jest', 'react-testing-library', 'unit-test', 'button', 'fireEvent'],
    concepts: ['testing-rtl-queries', 'testing-user-event'],
  },

  // 2. Coding (JSX): Test async component with fetch
  {
    id: 'next-testing-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Write a test for a UserProfile component that fetches user data from /api/users/1 on mount and displays the user\'s name. Mock the global fetch with jest.fn() to return { name: "Alice", email: "alice@test.com" }. Use findByText (async) to wait for the data to appear. Also test that a loading state shows while fetching.',
    starterCode: `import { render, screen } from "@testing-library/react";
import { UserProfile } from "./UserProfile";

// UserProfile fetches from /api/users/1 on mount
// Shows "Loading..." until data arrives
// Then shows <h1>{user.name}</h1>

describe("UserProfile", () => {
  // TODO: mock fetch, test loading and loaded states
});`,
    testCases: [
      {
        input: 'Async component test',
        expectedOutput: 'jest.fn mock fetch, findByText for async, getByText for loading',
        description: 'Should mock fetch and test loading/loaded states',
      },
    ],
    solution: `import { render, screen } from "@testing-library/react";
import { UserProfile } from "./UserProfile";

describe("UserProfile", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: "Alice", email: "alice@test.com" }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shows loading state initially", () => {
    render(<UserProfile />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays user name after fetch completes", async () => {
    render(<UserProfile />);
    const userName = await screen.findByText("Alice");
    expect(userName).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith("/api/users/1");
  });
});`,
    explanation:
      'Testing async components requires two key techniques: mocking the data source (here, global.fetch) and waiting for the UI to update. findByText is the async version of getByText — it retries until the element appears or times out (default 1000ms). This avoids flaky tests that depend on timing. We mock fetch in beforeEach so each test gets a fresh mock, and restoreAllMocks in afterEach cleans up to prevent test pollution. The loading state test uses getByText (synchronous) because the loading text is rendered immediately before the fetch resolves.',
    hints: [
      'Mock global.fetch to return a Promise that resolves with { json: () => Promise.resolve(data) }',
      'Use findByText (async) for elements that appear after state updates',
      'Use getByText (sync) for elements rendered immediately',
    ],
    tags: ['jest', 'react-testing-library', 'async', 'fetch', 'mock'],
    concepts: ['testing-rtl-queries', 'js-promises-async'],
  },

  // 3. MC: getByText vs queryByText vs findByText (correct answer index 0 → position a)
  {
    id: 'next-testing-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    question: 'What is the difference between getByText, queryByText, and findByText in React Testing Library?',
    options: [
      {
        id: 'a',
        text: 'getByText throws if the element is not found, queryByText returns null if not found, and findByText waits and retries asynchronously — use findByText for elements that appear after async operations',
        isCorrect: true,
      },
      {
        id: 'b',
        text: 'They all work the same way but findByText is faster because it uses requestAnimationFrame',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'getByText searches by exact text, queryByText supports regex, and findByText supports CSS selectors',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'getByText is for unit tests, queryByText for integration tests, and findByText for E2E tests',
        isCorrect: false,
      },
    ],
    explanation:
      'These three variants exist for different use cases: getBy* is for elements that should be in the DOM right now — it throws immediately if not found, which gives a clear error. queryBy* returns null instead of throwing, making it perfect for asserting something is NOT rendered (expect(queryByText("Error")).not.toBeInTheDocument()). findBy* returns a Promise and retries using waitFor under the hood — use it for elements that appear after async operations like data fetching or state updates. All three support the same query types (text, role, testId, etc.).',
    hints: [
      'Think about when each would fail vs succeed',
      'Which one would you use to test that an error message is NOT shown?',
    ],
    tags: ['react-testing-library', 'queries', 'getBy', 'queryBy', 'findBy'],
    concepts: ['testing-rtl-queries', 'testing-async'],
  },

  // 4. MC: getByRole vs getByTestId (correct answer index 1 → position b)
  {
    id: 'next-testing-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    question: 'Why does React Testing Library recommend screen.getByRole() over getByTestId()?',
    options: [
      {
        id: 'a',
        text: 'getByRole is faster because it uses native browser APIs instead of DOM traversal',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Role queries test what the user actually sees and interacts with — they verify accessible names and ARIA roles, catching accessibility issues. Test IDs are implementation details invisible to users.',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'getByTestId does not work in React 18 due to concurrent mode changes',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'getByRole supports regex matching while getByTestId only supports exact strings',
        isCorrect: false,
      },
    ],
    explanation:
      'RTL\'s guiding principle is "the more your tests resemble the way your software is used, the more confidence they give you." Users and screen readers interact with elements by their role (button, textbox, heading) and accessible name, not by data-testid attributes. getByRole("button", { name: "Submit" }) verifies that the element is both a button AND has the correct accessible name — if you accidentally change it to a div, the test fails, catching a real bug. getByTestId would still pass even if the element is no longer interactive. Use getByTestId only as a last resort for elements with no semantic role.',
    hints: [
      'Think about how a screen reader user navigates a page',
      'What would happen if you changed a <button> to a <div> — which query catches that?',
    ],
    tags: ['react-testing-library', 'getByRole', 'accessibility', 'testing-best-practices'],
    concepts: ['testing-rtl-queries', 'a11y-aria-roles'],
  },

  // 5. Coding (JSX): Test form submission
  {
    id: 'next-testing-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Write a test for a ContactForm component that has name (text input), email (email input), and message (textarea) fields plus a Submit button. Fill in all fields using fireEvent.change, submit the form, and assert that the onSubmit prop was called with { name: "John", email: "john@test.com", message: "Hello" }.',
    starterCode: `import { render, screen, fireEvent } from "@testing-library/react";
import { ContactForm } from "./ContactForm";

// ContactForm has: name input, email input, message textarea, Submit button
// On submit it calls props.onSubmit({ name, email, message })

describe("ContactForm", () => {
  // TODO: fill form and test submission
});`,
    testCases: [
      {
        input: 'Form submission test',
        expectedOutput: 'fireEvent.change for inputs, fireEvent.submit or click, expect onSubmit called with data',
        description: 'Should fill form fields and verify submit handler receives correct data',
      },
    ],
    solution: `import { render, screen, fireEvent } from "@testing-library/react";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  it("calls onSubmit with form data when submitted", () => {
    const handleSubmit = jest.fn();
    render(<ContactForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /message/i }), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: "John",
      email: "john@test.com",
      message: "Hello",
    });
  });
});`,
    explanation:
      'Testing form submission exercises the full user flow: find inputs, type values, click submit, verify the result. fireEvent.change simulates a change event with a new value — you pass { target: { value: "..." } } to set the input\'s value. We find inputs by their accessible role and name (/name/i uses regex for case-insensitive matching of the label). After clicking Submit, we verify the mock was called with the exact data object the user entered. This is an integration test — it tests the form as a whole, not individual inputs.',
    hints: [
      'fireEvent.change(element, { target: { value: "new value" } })',
      'Use getByRole("textbox", { name: /label/i }) to find inputs by label',
      'toHaveBeenCalledWith checks the exact arguments passed to the mock',
    ],
    tags: ['jest', 'react-testing-library', 'form', 'fireEvent', 'integration-test'],
    concepts: ['testing-rtl-queries', 'web-html-forms-a11y', 'testing-user-event'],
  },

  // 6. MC: MSW vs jest.mock (correct answer index 2 → position c)
  {
    id: 'next-testing-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    question: 'What is MSW (Mock Service Worker) and why use it over jest.mock for API mocking?',
    options: [
      {
        id: 'a',
        text: 'MSW is a browser extension that records real API calls and replays them — it only works in the browser',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'MSW is faster than jest.mock because it uses WebAssembly to process requests',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'MSW intercepts network requests at the service worker level, so it tests the full fetch/axios pipeline including headers, error handling, and request parsing. jest.mock bypasses the network layer entirely, so bugs in request construction go undetected.',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'MSW and jest.mock are identical in behavior but MSW has a nicer API',
        isCorrect: false,
      },
    ],
    explanation:
      'jest.mock("./api") replaces your API module with a fake — the actual fetch/axios call never happens, so you cannot catch bugs like wrong headers, incorrect URL construction, or missing error handling. MSW intercepts at the network level: your code makes a real fetch() call, MSW catches it and returns your mock response. This means you test the entire request pipeline. MSW handlers also work in both Node (tests) and browser (development), so you can use the same mocks for Storybook and manual testing. It gives you much higher confidence that your code works with a real API.',
    hints: [
      'Think about what jest.mock actually skips — the entire HTTP request',
      'What bugs could hide if the fetch call itself is never executed?',
    ],
    tags: ['msw', 'mock-service-worker', 'jest', 'api-mocking', 'testing'],
    concepts: ['testing-msw-mocking', 'testing-rtl-queries'],
  },

  // 7. Coding (TypeScript): MSW handler setup
  {
    id: 'next-testing-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Set up MSW (Mock Service Worker) handlers for a REST API. Define handlers for: GET /api/users (returns a JSON array of users: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]) and POST /api/users (reads the JSON body, returns the created user with an id of 3 and status 201). Export the handlers array. Use the msw v2 API with http.get and http.post.',
    starterCode: `import { http, HttpResponse } from "msw";

// TODO: define handlers for GET and POST /api/users
export const handlers = [];`,
    testCases: [
      {
        input: 'MSW handlers',
        expectedOutput: 'http.get and http.post with HttpResponse.json',
        description: 'Should define GET and POST handlers returning appropriate JSON responses',
      },
    ],
    solution: `import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  }),

  http.post("/api/users", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { id: 3, ...body },
      { status: 201 }
    );
  }),
];`,
    explanation:
      'MSW v2 uses http.get/post/put/delete to define request handlers. Each handler receives a resolver function with the request info (params, request body, cookies). HttpResponse.json() creates a JSON response — you can pass a second argument for status code, headers, etc. These handlers are typically defined in a handlers.ts file and passed to setupServer (Node/tests) or setupWorker (browser). The handlers intercept matching requests and return your mock responses, letting your code exercise the full fetch pipeline while controlling the data.',
    hints: [
      'Use http.get("/api/users", resolverFn) and http.post("/api/users", resolverFn)',
      'HttpResponse.json(data) creates a JSON response',
      'For POST, access the body with await request.json()',
    ],
    tags: ['msw', 'mock-service-worker', 'handlers', 'api-mocking', 'typescript'],
    concepts: ['testing-msw-mocking'],
  },

  // 8. MC: Testing trophy (correct answer index 3 → position d)
  {
    id: 'next-testing-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    question: 'What is the "Testing Trophy" and what does it recommend about where to invest testing effort?',
    options: [
      {
        id: 'a',
        text: 'Write as many unit tests as possible since they are the fastest and cheapest to maintain',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Focus entirely on E2E tests because they give the most confidence',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Skip testing and rely on TypeScript for all correctness guarantees',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Prioritize integration tests (the widest part of the trophy) because they give the most confidence per effort. Static analysis at the base, then unit tests, integration tests (largest), and E2E tests at the top.',
        isCorrect: true,
      },
    ],
    explanation:
      'The Testing Trophy (coined by Kent C. Dodds) differs from the traditional Testing Pyramid. It recommends: Static analysis (TypeScript, ESLint) catches typos and type errors cheaply. Unit tests verify isolated logic (pure functions, utilities). Integration tests (the biggest investment) test components working together — RTL tests that render a component with its children, make API calls, and assert the result. E2E tests (Playwright/Cypress) cover critical user flows. The key insight is that integration tests catch the most real-world bugs because most bugs happen at the boundaries between components, not within isolated units.',
    hints: [
      'Think about where most real bugs occur — within a single function or between components?',
      'The trophy shape means the widest section is the focus area',
    ],
    tags: ['testing-trophy', 'testing-strategy', 'integration-tests', 'best-practices'],
    concepts: ['testing-rtl-queries'],
  },

  // 9. Coding (JSX): Test a custom hook with renderHook
  {
    id: 'next-testing-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Write a test for a useCounter custom hook that returns { count, increment, decrement }. The hook starts at 0. Test that: 1) initial count is 0, 2) increment increases count by 1, 3) decrement decreases count by 1. Use renderHook from @testing-library/react and wrap state updates in act().',
    starterCode: `// Import renderHook + act from "@testing-library/react" and useCounter
// describe("useCounter", ...) with three it() blocks:
//   initial count is 0 (read result.current.count)
//   calling increment inside act() yields count 1
//   calling decrement inside act() yields count -1
`,
    testCases: [
      {
        input: 'Custom hook test with renderHook',
        expectedOutput: 'renderHook, result.current, act for state updates',
        description: 'Should test hook state and methods using renderHook and act',
      },
    ],
    solution: `import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("starts with count 0", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("increments the count", () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  it("decrements the count", () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(-1);
  });
});`,
    explanation:
      'Hooks cannot be called outside of React components, so renderHook wraps your hook in a test component automatically. result.current gives you the current return value of the hook — it updates after state changes. act() is required around any code that triggers state updates (like calling increment()) because React needs to process the update and re-render before you can assert on the new value. Without act(), you would read stale state. Each test creates a fresh hook instance via a new renderHook call, so tests are isolated.',
    hints: [
      'renderHook(() => useCounter()) returns { result }',
      'Access return values with result.current.count',
      'Wrap state-changing calls in act(() => { ... })',
    ],
    tags: ['renderHook', 'custom-hooks', 'act', 'jest', 'react-testing-library'],
    concepts: ['react-custom-hooks', 'testing-rtl-queries'],
  },

  // 10. MC: Playwright vs RTL (correct answer index 0 → position a)
  {
    id: 'next-testing-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    question: 'When should you use Playwright (E2E) vs React Testing Library (integration)?',
    options: [
      {
        id: 'a',
        text: 'Use RTL for component logic and user flows within a page (form validation, data display, interactions). Use Playwright for multi-page flows, authentication, real browser behavior, and cross-browser testing.',
        isCorrect: true,
      },
      {
        id: 'b',
        text: 'Always use Playwright because it tests real browsers and RTL only tests in jsdom which is unreliable',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Use RTL for server components and Playwright for client components',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'They are interchangeable — use whichever your team prefers for all testing needs',
        isCorrect: false,
      },
    ],
    explanation:
      'RTL runs in Node with jsdom (fast, no real browser) — perfect for testing component behavior, user interactions, and data display within a page. It is fast enough to run on every save. Playwright runs a real browser (Chromium, Firefox, WebKit) — essential for testing page navigation, authentication flows, cookies/localStorage across pages, file uploads, and cross-browser compatibility. Playwright tests are slower and more brittle (network, timing), so reserve them for critical user journeys. Most apps need both: many RTL integration tests and a smaller set of Playwright E2E tests for key flows.',
    hints: [
      'Think about speed vs fidelity tradeoffs',
      'What can only be tested in a real browser?',
    ],
    tags: ['playwright', 'react-testing-library', 'e2e', 'integration', 'testing-strategy'],
    concepts: ['testing-rtl-queries'],
  },

  // 11. Coding (TypeScript): Playwright E2E test
  {
    id: 'next-testing-11',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Write a Playwright E2E test for a login flow. The test should: 1) navigate to /login, 2) fill the email input with "user@test.com", 3) fill the password input with "password123", 4) click the "Log In" button, 5) expect the URL to change to /dashboard, 6) expect a heading "Welcome back" to be visible. Use Playwright\'s page.goto, page.fill (or getByLabel), page.click (or getByRole), and expect.',
    starterCode: `import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  // TODO: write E2E login test
});`,
    testCases: [
      {
        input: 'Playwright login test',
        expectedOutput: 'page.goto, fill, click, expect URL and heading',
        description: 'Should test full login flow with navigation and assertions',
      },
    ],
    solution: `import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test("logs in and redirects to dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("user@test.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(page).toHaveURL(/\\/dashboard/);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });
});`,
    explanation:
      'Playwright tests run in a real browser, so they test the complete user experience including server-side rendering, client-side hydration, API calls, and navigation. page.goto() navigates to a URL. getByLabel() and getByRole() are Playwright\'s accessibility-first locators (similar philosophy to RTL). fill() types into an input. All Playwright actions auto-wait for the element to be ready — no manual waitFor needed. expect(page).toHaveURL() waits for navigation to complete. These auto-waiting semantics make Playwright tests less flaky than manual waits.',
    hints: [
      'Playwright auto-waits for elements — no need for manual delays',
      'Use getByLabel and getByRole for accessible locators',
      'expect(page).toHaveURL() waits for navigation',
    ],
    tags: ['playwright', 'e2e', 'login', 'navigation', 'testing'],
    concepts: ['testing-async'],
  },

  // 12. MC: jest.mock('next/navigation') (correct answer index 1 → position b)
  {
    id: 'next-testing-12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    question: 'What does jest.mock("next/navigation") do and when do you need it?',
    options: [
      {
        id: 'a',
        text: 'It enables client-side navigation in test environments so Link components work',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'It mocks useRouter, usePathname, useSearchParams, and other navigation hooks — needed when testing components that use Next.js routing because these hooks require the Next.js runtime context that does not exist in Jest',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'It replaces the browser History API with an in-memory implementation for faster tests',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'It is only needed for server components that use redirect()',
        isCorrect: false,
      },
    ],
    explanation:
      'Next.js navigation hooks (useRouter, usePathname, useSearchParams) depend on Next.js internal context providers that are not available in a plain Jest/RTL test environment. Without mocking, any component that calls useRouter() will throw. jest.mock("next/navigation") replaces the module with mock functions you can control: const mockPush = jest.fn(); jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) })). This lets you assert that router.push("/dashboard") was called without needing a real Next.js server.',
    hints: [
      'Think about what happens when useRouter() is called outside of Next.js',
      'You need to provide mock return values for the hooks your component uses',
    ],
    tags: ['jest', 'next.js', 'useRouter', 'mock', 'navigation'],
    concepts: ['testing-rtl-queries'],
  },

  // 13. MC: Testing Server Components (correct answer index 2 → position c)
  {
    id: 'next-testing-13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    question: 'How do you test React Server Components in Next.js?',
    options: [
      {
        id: 'a',
        text: 'Use React Testing Library\'s render() — Server Components work the same as Client Components in tests',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Server Components cannot be tested — you must convert them to Client Components first',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'They are async functions that return JSX — you can test the output directly by calling them as functions and awaiting the result, mocking the data layer (database, fetch). For simple cases, you do not need RTL.',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'Only Playwright can test Server Components because they require a running server',
        isCorrect: false,
      },
    ],
    explanation:
      'Server Components are just async functions: async function UserList() { const users = await db.user.findMany(); return <ul>...</ul>; }. You can test them by: 1) mocking the data layer (jest.mock the DB or fetch), 2) calling the component as a function: const result = await UserList(), 3) asserting on the returned JSX. For more complex testing, you can render the result with RTL. The key insight is that there is no client-side state or effects — it is pure input-to-output, which is actually simpler to test than Client Components. E2E tests with Playwright test the full SSR pipeline if needed.',
    hints: [
      'Server Components are async functions — what does that make them from a testing perspective?',
      'Think about what you would mock: the data source, not React internals',
    ],
    tags: ['server-components', 'next.js', 'testing', 'async', 'jest'],
    concepts: ['next-server-vs-client', 'js-promises-async', 'testing-rtl-queries'],
  },

  // 14. MC: Snapshot testing (correct answer index 3 → position d)
  {
    id: 'next-testing-14',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    question: 'What is snapshot testing and when should you avoid it?',
    options: [
      {
        id: 'a',
        text: 'Snapshot testing takes screenshots of components and compares pixels — avoid it when components have animations',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Snapshot testing is always the best approach because it tests everything at once',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Snapshot testing is only for CSS — it captures computed styles and diffs them',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'It captures rendered output (DOM structure) as a file and diffs against it on subsequent runs. Avoid it for frequently changing or complex components where developers blindly update snapshots without reviewing — it becomes meaningless noise. Best for stable, simple components like icons or formatted text.',
        isCorrect: true,
      },
    ],
    explanation:
      'Snapshot testing (toMatchSnapshot or toMatchInlineSnapshot) serializes a component\'s rendered output to a file. On subsequent test runs, it compares against the stored snapshot and fails if anything changed. The problem: developers often run "update all snapshots" without reviewing diffs, especially for large, complex components. This defeats the purpose — the test passes but nobody verified the change was intentional. Snapshots work well for small, stable components (icons, badges, formatted dates) where any change is likely unintentional. For complex components, write specific assertions (getByRole, toHaveTextContent) that document intended behavior.',
    hints: [
      'Think about what happens when a developer sees "15 snapshot tests failed"',
      'Would you carefully review a 500-line snapshot diff?',
    ],
    tags: ['snapshot-testing', 'jest', 'testing-best-practices', 'anti-patterns'],
    concepts: ['testing-rtl-queries'],
  },

  // 15. Coding (JSX): Integration test — UserList with MSW
  {
    id: 'next-testing-15',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Write an integration test for a UserList component that fetches users from /api/users on mount and renders each user\'s name in a list. Use MSW (setupServer) to mock the API, returning [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]. Set up the server in beforeAll/afterAll/afterEach. Render the component and use findByText to verify both names appear.',
    starterCode: `import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { UserList } from "./UserList";

// UserList fetches GET /api/users on mount
// Renders: <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>

// TODO: set up MSW server, write test`,
    testCases: [
      {
        input: 'Integration test with MSW',
        expectedOutput: 'setupServer, beforeAll/afterAll, render, findByText',
        description: 'Should mock API with MSW and test async component rendering',
      },
    ],
    solution: `import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { UserList } from "./UserList";

const server = setupServer(
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("UserList", () => {
  it("fetches and displays users", async () => {
    render(<UserList />);

    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(await screen.findByText("Bob")).toBeInTheDocument();
  });

  it("shows error message when API fails", async () => {
    server.use(
      http.get("/api/users", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<UserList />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});`,
    explanation:
      'This is a full integration test combining MSW for API mocking with RTL for component testing. setupServer creates a mock server that intercepts fetch/axios requests in Node. server.listen() starts interception, server.resetHandlers() restores original handlers between tests (cleaning up server.use overrides), and server.close() stops interception. The second test uses server.use() to override the default handler for a single test, simulating a server error. findByText waits for the async fetch to complete and the UI to update. This test exercises the entire component lifecycle: mount → fetch → render data, giving high confidence the component works correctly.',
    hints: [
      'setupServer() creates the server, .listen() starts it, .close() stops it',
      'Use server.resetHandlers() in afterEach to clean up per-test overrides',
      'server.use() adds one-time handler overrides for testing error states',
    ],
    tags: ['msw', 'react-testing-library', 'integration-test', 'setupServer', 'async'],
    concepts: ['testing-msw-mocking', 'testing-rtl-queries', 'js-promises-async'],
  },

  // 16. Cloze: getByLabelText for accessible form-field queries
  {
    id: 'next-testing-cloze-labeltext',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the test: find the email input by the text of its associated <label>, then set its value.',
    template: `render(<ContactForm />);
const emailInput = screen.___("Email");
fireEvent.change(emailInput, { target: { value: "a@test.com" } });`,
    blanks: ['getByLabelText'],
    solution: `render(<ContactForm />);
const emailInput = screen.getByLabelText("Email");
fireEvent.change(emailInput, { target: { value: "a@test.com" } });`,
    explanation:
      'getByLabelText finds a form control by the text of its associated <label> - the same relationship a screen reader uses to announce the field. It only works when the label is properly wired to the input (htmlFor/id, or the input nested inside the label), so a failing query here is often a real accessibility bug, not just a flaky test.',
    hints: [
      'The query that matches an input via its <label> text',
    ],
    tags: ['react-testing-library', 'getByLabelText', 'accessibility', 'cloze'],
    concepts: ['testing-rtl-queries', 'a11y-aria-roles'],
  },

  // 17. Parsons: beforeEach/afterEach setup-teardown ordering
  {
    id: 'next-testing-parsons-2',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Assemble the MSW server lifecycle hooks in the order Jest runs them: once before all tests, after every test, and once after all tests.',
    correctOrder: [
      'beforeAll(() => server.listen());',
      'afterEach(() => server.resetHandlers());',
      'afterAll(() => server.close());',
    ],
    distractorLines: [
      'beforeEach(() => server.listen());',
      'afterAll(() => server.resetHandlers());',
    ],
    solution: `beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`,
    explanation:
      'beforeAll runs once before the whole suite, so the server starts listening a single time rather than being torn down and rebuilt per test. afterEach resets any per-test handler overrides (from server.use()) so tests stay isolated from each other. afterAll closes the server once the entire suite finishes. Swapping beforeAll/beforeEach here would restart the server before every single test - wasteful and unnecessary since resetHandlers already isolates tests.',
    hints: [
      'Only one hook needs to run before EVERY test - which lifecycle event needs resetting per test, not the whole server?',
      'listen and close are expensive - run them once per suite, not per test',
    ],
    tags: ['jest', 'msw', 'beforeAll', 'afterEach', 'setup-teardown', 'parsons'],
    concepts: ['testing-msw-mocking'],
  },

  // 18. Cloze: userEvent.setup() + userEvent.click (modernization from fireEvent)
  {
    id: 'next-testing-cloze-userevent',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the modernized test: create a userEvent session, then use it to click the button (the call must be awaited).',
    template: `const user = userEvent.___();
render(<Button onClick={handleClick}>Save</Button>);
await user.___(screen.getByRole("button", { name: "Save" }));`,
    blanks: ['setup', 'click'],
    solution: `const user = userEvent.setup();
render(<Button onClick={handleClick}>Save</Button>);
await user.click(screen.getByRole("button", { name: "Save" }));`,
    explanation:
      'userEvent.setup() creates a session that simulates a full sequence of real browser events (pointerdown, mousedown, focus, mouseup, click) instead of firing one synthetic event like fireEvent.click does. Every userEvent interaction is async and must be awaited, which is why user.click() (unlike fireEvent.click()) returns a Promise - this catches bugs that only surface with the intermediate events real users trigger, like a focus handler that fireEvent would skip entirely.',
    hints: [
      'The function that creates a userEvent session',
      'The method that simulates a realistic click sequence, awaited',
    ],
    tags: ['react-testing-library', 'userEvent', 'fireEvent', 'cloze'],
    concepts: ['testing-user-event', 'testing-rtl-queries'],
  },

  // 19. MC: userEvent vs fireEvent
  {
    id: 'next-testing-16',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    question: 'Every test in your suite uses `fireEvent.click(button)`. A teammate suggests migrating to `await userEvent.click(button)` from `@testing-library/user-event`. What is the actual difference between the two?',
    options: [
      { id: 'a', text: 'They dispatch the exact same underlying DOM events in the exact same order - userEvent is only a thin wrapper that adds automatic retries around fireEvent for flaky CI environments, with no behavioral difference otherwise', isCorrect: false },
      { id: 'b', text: 'fireEvent only works correctly with legacy class components, while userEvent is required for any function component that relies on hooks like useState or useEffect internally', isCorrect: false },
      { id: 'c', text: 'fireEvent.click dispatches a single synthetic "click" DOM event. userEvent.click simulates the fuller sequence a real mouse click triggers (pointerdown, mousedown, focus, mouseup, click), so it catches bugs in handlers that depend on those intermediate events - this is why Testing Library\'s own docs recommend userEvent as the default', isCorrect: true },
      { id: 'd', text: 'userEvent has been deprecated in favor of fireEvent as of Testing Library v14, specifically because of the extra async overhead userEvent adds to every simulated interaction', isCorrect: false },
    ],
    explanation: 'fireEvent is a thin wrapper that dispatches exactly the DOM event you name - fireEvent.click fires only a "click" event, skipping everything a real click actually produces along the way. userEvent.click simulates the realistic sequence a browser fires for a physical click: pointer and mouse events, a focus event if the target is focusable, then the click itself. A button with an onFocus side effect, or a component that only updates state on mousedown, would pass a fireEvent-based test while being broken for real users - userEvent catches that gap, which is why Testing Library\'s guidance now treats it as the default over fireEvent for user interactions.',
    hints: [
      'Count the actual DOM events a real click produces versus what fireEvent.click fires',
      'Think about a handler wired to onFocus or onMouseDown instead of onClick',
    ],
    tags: ['react-testing-library', 'userEvent', 'fireEvent', 'testing-best-practices'],
    concepts: ['testing-user-event', 'testing-rtl-queries'],
  },

  // 20. Cloze: waitFor for async assertions beyond findBy
  {
    id: 'next-testing-cloze-waitfor',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the assertion: wait until the mock has been called, since the save happens after a debounce delay rather than producing new text to query for.',
    template: `fireEvent.change(screen.getByRole("textbox"), { target: { value: "draft" } });
await ___(() => {
  expect(handleSave).toHaveBeenCalledWith("draft");
});`,
    blanks: ['waitFor'],
    solution: `fireEvent.change(screen.getByRole("textbox"), { target: { value: "draft" } });
await waitFor(() => {
  expect(handleSave).toHaveBeenCalledWith("draft");
});`,
    explanation:
      'findBy* queries only help when you are waiting for an ELEMENT to appear in the DOM. waitFor is more general: it retries any callback (usually containing one or more expect assertions) until it stops throwing or times out. That makes it the right tool here, since a debounced save calls a mock function rather than rendering new text you could query for.',
    hints: [
      'The general-purpose retry helper for any assertion, not just DOM queries',
    ],
    tags: ['react-testing-library', 'waitFor', 'async', 'debounce', 'cloze'],
    concepts: ['testing-async', 'testing-rtl-queries'],
  },

  // 21. Cloze: jest.spyOn + mockRestore
  {
    id: 'next-testing-cloze-spyon',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the spy: watch the real Date.now implementation without replacing its behavior, then restore the original implementation after the test.',
    template: `const spy = jest.___(Date, "now");
// ... run code that calls Date.now() ...
expect(spy).toHaveBeenCalled();
spy.___();`,
    blanks: ['spyOn', 'mockRestore'],
    solution: `const spy = jest.spyOn(Date, "now");
// ... run code that calls Date.now() ...
expect(spy).toHaveBeenCalled();
spy.mockRestore();`,
    explanation:
      'jest.spyOn(obj, "method") wraps the real method so it still runs normally while recording calls - unlike jest.fn(), which replaces a function entirely with a bare mock that does nothing unless you tell it to. spy.mockRestore() puts the original, un-spied implementation back afterward, which matters for built-ins like Date.now that other tests (or the same test file) also rely on behaving normally.',
    hints: [
      'The Jest method that wraps a real method while still calling through to it',
      'The method that restores the original implementation after the test',
    ],
    tags: ['jest', 'spyOn', 'mockRestore', 'cloze'],
    concepts: ['testing-rtl-queries'],
  },
];
