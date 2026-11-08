import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

export const formsTestingQuestions: Question[] = [

  // =====================================================================
  // NEXT_FORMS_VALIDATION (22 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) - lower-load scaffold before cold coding
  {
    id: 'next-forms-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Assemble a Zod schema for a sign-in form, with the email field before the password field, then declare the TypeScript type inferred from it as SignInValues.',
    correctOrder: [
      'const schema = z.object({',
      '  email: z.string().email(),',
      '  password: z.string().min(8),',
      '});',
      'type SignInValues = z.infer<typeof schema>;',
    ],
    distractorLines: [
      '  email: z.string.email(),',
      'type SignInValues = z.infer<schema>;',
    ],
    solution: `const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type SignInValues = z.infer<typeof schema>;`,
    explanation:
      '`z.string()` is a function call, and its checks chain on the schema it returns: `z.string().email()`, not `z.string.email()`. `schema` is a value, not a type, so `z.infer` needs `typeof schema` to get its type; `z.infer<schema>` does not compile. Writing the rules once and inferring the type keeps the two from drifting apart. The type is not called `FormData`, because that name would hide the browser\'s `FormData` type, the one a Server Action receives. Zod 4 also writes the email check as `z.email()`; `z.string().email()` is the Zod 3 form, deprecated in Zod 4 but still working.',
    hints: [
      'Checks chain on what `z.string()` returns, so it needs its brackets',
      '`z.infer` takes the type of the schema value: `typeof schema`',
      'One field per line inside `z.object()`',
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
      'Complete the Zod field checks: one checks the string is a valid email address, the other enforces a minimum length.',
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
      'Each Zod check takes an optional custom message as its last argument, and that message is what the form shows for the field. `.email()` checks the address format, and `.min(n)` on a string checks it has at least n characters. Zod 4 also writes the email check as `z.email("Invalid email")`; `z.string().email()` is the Zod 3 form, deprecated in Zod 4 but still working.',
    hints: [
      'The check named after the kind of address it accepts',
      'The check that sets a lower bound on the length',
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

  // 1. Coding (JSX): Basic React Hook Form - login form
  {
    id: 'next-forms-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Create a LoginForm component with React Hook Form and no Zod: the rules go in register() itself. Get register, handleSubmit and formState.errors from useForm().

- email: required, and must match an email pattern (register's pattern rule takes a regular expression and a message)
- password: required, with a minimum length of 8 (the minLength rule)

Show each field's error message below its input, and on a valid submit call the onSubmit prop with the data.`,
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
}
# OR
"use client";
import { useForm } from "react-hook-form";

function LoginForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        {...register("email", {
          required: "Email is required",
          pattern: { value: /\\S+@\\S+\\.\\S+/, message: "Invalid email address" },
        })}
      />
      <p>{errors.email?.message}</p>
      <input
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
        })}
      />
      <p>{errors.password?.message}</p>
      <button type="submit">Log In</button>
    </form>
  );
}
# OR
"use client";
import { useForm } from "react-hook-form";

function LoginForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: true, pattern: /^\\S+@\\S+\\.\\S+$/ })} />
      {errors.email && <span>Enter a valid email address</span>}
      <input type="password" {...register("password", { required: true, minLength: 8 })} />
      {errors.password && <span>Password must be at least 8 characters</span>}
      <button type="submit">Log In</button>
    </form>
  );
}`,
    requires: [
      /useForm\(/,
      /handleSubmit\(/,
      /register\(\s*["']email["']\s*,\s*\{[\s\S]*?required/,
      /pattern\s*:/,
      /register\(\s*["']password["']\s*,\s*\{[\s\S]*?minLength\s*:\s*(\{\s*value\s*:\s*)?8\b/,
      /errors\.email/,
      /errors\.password/,
    ],
    explanation:
      'Without a resolver, the rules go in the second argument of `register()`: `required` (true or a message), `pattern: { value: /regex/, message }`, and `minLength: { value: 8, message }` (or just `minLength: 8`). `register()` returns `name`, `ref`, `onChange` and `onBlur`, so the inputs stay uncontrolled and the form does not re-render on every keystroke. `handleSubmit(onSubmit)` stops the page reload, runs the rules and calls `onSubmit` only with valid data. `formState.errors` then holds an entry per failing field, whose `message` is the one you wrote; with `required: true` there is no message to show. The `type="email"` attribute is extra: the browser checks it too, but React Hook Form\'s `pattern` rule is what fills `errors`.',
    hints: [
      'Destructure { register, handleSubmit, formState: { errors } } from useForm()',
      'Spread {...register("fieldName", rules)} on each input',
      'Wrap onSubmit with handleSubmit: onSubmit={handleSubmit(onSubmit)}',
    ],
    tieredHints: {
      apiSignature: 'register(name, { required, pattern: { value, message }, minLength: { value, message } }); handleSubmit(onValid)',
      skeleton: 'function LoginForm({ onSubmit }) {\n  const { register, handleSubmit, formState: { errors } } = useForm();\n\n  return (\n    <form onSubmit={____(onSubmit)}>\n      <input {...____("email", { required: "Required", pattern: ____ })} />\n      {____.email && <p>{errors.email.message}</p>}\n      <button type="submit">Log In</button>\n    </form>\n  );\n}',
    },
    tags: ['react-hook-form', 'useForm', 'register', 'validation', 'forms'],
    concepts: ['forms-rhf-controller', 'web-html-forms-a11y'],
  },

  // 2. Coding (TypeScript): Zod schema for registration form
  {
    id: 'next-forms-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: `In schema.ts, define and export a Zod schema called registrationSchema for a registration form:

- email: a valid email address
- password: at least 8 characters
- confirmPassword: a string
- name: at least 2 characters

Add a .refine() on the whole object that checks password and confirmPassword match, with the message "Passwords do not match" attached to confirmPassword. Export the inferred TypeScript type as RegistrationValues.`,
    starterCode: `import { z } from "zod";

// TODO: export registrationSchema, with a .refine() on the object
// TODO: export type RegistrationValues = the type inferred from it`,
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

export type RegistrationValues = z.infer<typeof registrationSchema>;
# OR
import { z } from "zod";

export const registrationSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    name: z.string().min(2),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegistrationValues = z.infer<typeof registrationSchema>;`,
    requires: [
      /export\s+const\s+registrationSchema\b/,
      /email\s*:\s*z\.(string\(\)\.)?email\(/,
      /password\s*:\s*z\.string\(\)\.min\(\s*8\b/,
      /confirmPassword\s*:\s*z\.string\(\)/,
      /name\s*:\s*z\.string\(\)\.min\(\s*2\b/,
      /\.refine\(/,
      /\bpassword\s*===?\s*(\w+\.)?confirmPassword\b|\bconfirmPassword\s*===?\s*(\w+\.)?password\b/,
      /Passwords do not match/,
      /path\s*:\s*\[\s*["']confirmPassword["']\s*\]/,
      /export\s+type\s+RegistrationValues\s*=\s*z\.infer<\s*typeof\s+registrationSchema\s*>/,
    ],
    explanation:
      '`z.object()` defines the shape, and each field\'s checks chain on its schema. `.refine()` goes on the whole object because it is the only place that can see two fields at once: it receives the object and returns true when it is valid. It runs once every field has the right type, even if a field\'s own check fails, so a short, mismatched password shows both messages. `path: ["confirmPassword"]` attaches "Passwords do not match" to confirmPassword instead of to the form as a whole. `z.infer<typeof registrationSchema>` gives the type, so the type and the rules stay in step; the name RegistrationValues (not FormData) keeps the browser\'s `FormData` type usable in the same files. Zod 4 also writes the email check as `z.email()`; `z.string().email()` is the Zod 3 form, deprecated in Zod 4 but still working, and both are accepted.',
    hints: [
      'Use z.string().email() (or Zod 4\'s z.email()) for the email field',
      '.refine() goes on the whole z.object(), not on one field',
      'path: ["confirmPassword"] attaches the error to the right field',
    ],
    tieredHints: {
      apiSignature: 'z.object({ ... }).refine((data) => boolean, { message, path: [fieldName] }); type T = z.infer<typeof schema>',
      skeleton: 'export const registrationSchema = z.object({\n  email: z.string().____(),\n  password: z.string().min(8),\n  confirmPassword: z.string(),\n  name: ____,\n}).refine((data) => ____.password === ____.confirmPassword, {\n  message: "Passwords do not match",\n  path: ["____"],\n});\n\nexport type RegistrationValues = ____;',
    },
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
    question: 'Create a RegistrationForm component that connects a Zod schema to React Hook Form. The starter imports registrationSchema from ./schema (name, email, password and confirmPassword, with a .refine() that the passwords match). Pass zodResolver(registrationSchema) as the resolver to useForm. Render all four fields, each with its error message, and on a valid submit call the onSubmit prop with the data.',
    starterCode: `"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "./schema";

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
import { registrationSchema } from "./schema";

function RegistrationForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
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
}
# OR
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "./schema";

function RegistrationForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <p>{errors.name?.message}</p>
      <input type="email" {...register("email")} />
      <p>{errors.email?.message}</p>
      <input type="password" {...register("password")} />
      <p>{errors.password?.message}</p>
      <input type="password" {...register("confirmPassword")} />
      <p>{errors.confirmPassword?.message}</p>
      <button type="submit">Register</button>
    </form>
  );
}
# OR
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationValues } from "./schema";

function RegistrationForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationValues>({
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
    requires: [
      /useForm(<\s*RegistrationValues\s*>)?\(\s*\{[\s\S]*?resolver\s*:\s*zodResolver\(\s*registrationSchema\s*\)/,
      /handleSubmit\(/,
      /register\(\s*["']name["']\s*\)/,
      /register\(\s*["']email["']\s*\)/,
      /register\(\s*["']password["']\s*\)/,
      /register\(\s*["']confirmPassword["']\s*\)/,
      /errors\.name/,
      /errors\.email/,
      /errors\.password/,
      /errors\.confirmPassword/,
    ],
    explanation:
      'zodResolver bridges Zod and React Hook Form: with `resolver: zodResolver(registrationSchema)`, React Hook Form hands every check to the schema and fills `formState.errors` from Zod\'s issues, the refine\'s "Passwords do not match" included, under confirmPassword. So `register()` takes no rules here; the schema is the one place they live. In a TypeScript file, `useForm<RegistrationValues>(...)` is optional: the resolver already carries the schema\'s types, so `register("emial")` is a type error either way. After a failed submit, each field is checked again as the user types, so a fixed field\'s message goes away at once.',
    hints: [
      'Pass resolver: zodResolver(registrationSchema) to the useForm options',
      'No rules in register(): Zod does all the checking',
      'Each field\'s message is at errors.<field>.message',
    ],
    tieredHints: {
      apiSignature: 'useForm({ resolver: zodResolver(schema) }) returns { register, handleSubmit, formState: { errors } }',
      skeleton: 'const { register, handleSubmit, formState: { errors } } = useForm({\n  resolver: ____(registrationSchema),\n});\n\nreturn (\n  <form onSubmit={____(onSubmit)}>\n    <input {...register("email")} />\n    {____.email && <p>{errors.email.message}</p>}\n  </form>\n);',
    },
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
    question:
      'What does zodResolver do when passed to React Hook Form\'s useForm({ resolver: zodResolver(schema) })?',
    options: [
      {
        id: 'a',
        text: 'It connects the two: RHF runs the schema whenever it validates, and Zod\'s issues land in formState.errors',
        isCorrect: true,
      },
      {
        id: 'b',
        text: 'It turns the Zod schema into HTML validation attributes such as required and minlength on each input',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'It replaces React Hook Form\'s field tracking with Zod\'s, so the inputs no longer need register()',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'It checks the values only on the final submit, and cannot run on blur or change as register() rules can',
        isCorrect: false,
      },
    ],
    explanation:
      '`zodResolver(schema)`, from `@hookform/resolvers/zod`, returns a resolver function that React Hook Form calls every time it validates: on submit by default, on change or blur when `mode` asks for it, and on every change after a failed submit. It parses the form\'s values with the schema and turns each Zod issue into a `{ message, type }` entry under the field\'s name in `formState.errors`; when the values pass, your submit handler gets Zod\'s parsed output. Nothing is added to the HTML, and `register()` still wires every input; you just stop passing rules to it. The schema stays the one place the rules live, and the server can run the same schema again.',
    hints: [
      'Think about what a "resolver" resolves: the form\'s values into errors or valid data',
      'React Hook Form needs errors in its own shape, keyed by field name',
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
    question:
      'Why write a form\'s rules as a Zod schema instead of HTML attributes such as required and minLength, or rules passed to register()?',
    options: [
      {
        id: 'a',
        text: 'Zod checks run faster, because the schema is compiled into the browser\'s native validation',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'One schema gives the TypeScript type through z.infer and runs again in the Server Action',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'Next.js only accepts a Server Action\'s form data after a Zod schema has parsed it',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'HTML attributes and register() rules cannot check required fields or an email format',
        isCorrect: false,
      },
    ],
    explanation:
      '`z.infer<typeof schema>` turns the schema into the form\'s TypeScript type, so the type and the rules cannot drift apart. The same schema can run in the browser through zodResolver and again in the Server Action with `safeParse`, where it matters most, because a browser\'s checks can be skipped. HTML attributes live in the markup and `register()` rules in the component: neither gives you a type, and neither runs on the server. Both can check required fields and an email pattern, so that is not the reason. Zod is a JavaScript library, not compiled into the browser\'s validation, and Next.js does not require it. Schemas also compose: `.extend()`, `.pick()` and `.omit()` build new ones from one base.',
    hints: [
      'Where else does the same data need checking, besides the browser?',
      'What keeps the form\'s TypeScript type and its rules in step?',
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
    question: `Write a Next.js Server Action createUser(formData: FormData) in app/users/actions.ts, a file that starts with the "use server" directive.

- Read email, password and name from the FormData.
- Check them with a Zod schema (email a valid email address, password at least 8 characters, name at least 2) using safeParse().
- If the check fails, return { success: false, errors }, where errors is the map of field errors: z.flattenError(parsed.error).fieldErrors in Zod 4, or the Zod 3 form parsed.error.flatten().fieldErrors, which still works.
- Otherwise return { success: true, data: parsed.data } (a real app would save the user here).`,
    starterCode: `// app/users/actions.ts
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
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export async function createUser(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  };

  const parsed = userSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false as const,
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  // Save to the database here, e.g. await db.user.create({ data: parsed.data });

  return { success: true as const, data: parsed.data };
}
# OR
"use server";
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

  return { success: true as const, data: parsed.data };
}
# OR
"use server";
import { z } from "zod";

const userSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export async function createUser(formData: FormData) {
  const parsed = userSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { success: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  return { success: true, data: parsed.data };
}`,
    requires: [
      /^(\s*\/\/[^\n]*\n)*\s*["']use server["']/,
      /export\s+async\s+function\s+createUser\s*\(/,
      /formData\.get\(|Object\.fromEntries\(\s*formData\s*\)/,
      /email\s*:\s*z\.(string\(\)\.)?email\(/,
      /password\s*:\s*z\.string\(\)\.min\(\s*8\b/,
      /name\s*:\s*z\.string\(\)\.min\(\s*2\b/,
      /\.safeParse\(/,
      /success\s*:\s*false/,
      /\.fieldErrors\b/,
      /success\s*:\s*true/,
      /data\s*:\s*\w+\.data\b/,
    ],
    explanation:
      'A Server Action is a public endpoint: anyone can post to it without the form, so it checks the data again, whatever the browser checked. `"use server"` at the top of the file marks every export as a Server Action. `formData.get()` returns a string, a File or null, and Zod checks it as it is, so a missing field fails as "expected string" instead of slipping through; `Object.fromEntries(formData)` builds the same object in one go. `safeParse()` never throws: it returns `{ success: true, data }` or `{ success: false, error }`, so the action can send the errors back to the form instead of crashing. `z.flattenError(error).fieldErrors` (Zod 4; `error.flatten().fieldErrors` in Zod 3, deprecated but still working) gives `{ field: ["message"] }`, which the form can show next to each input. Return `parsed.data`, not the raw values: it is the checked, typed result.',
    hints: [
      'Use formData.get("fieldName") to read each value',
      'safeParse returns { success, data } or { success, error } and never throws',
      'z.flattenError(error).fieldErrors gives you { field: ["message"] }',
    ],
    tieredHints: {
      apiSignature: 'schema.safeParse(value): { success: true, data } | { success: false, error }; z.flattenError(error).fieldErrors',
      skeleton: '"use server";\nimport { z } from "zod";\n\nconst userSchema = z.object({ ____ });\n\nexport async function createUser(formData: FormData) {\n  const rawData = {\n    email: formData.get("email"),\n    password: ____,\n    name: ____,\n  };\n\n  const parsed = userSchema.____(rawData);\n\n  if (!parsed.____) {\n    return { success: false as const, errors: ____ };\n  }\n\n  return { success: true as const, data: ____ };\n}',
    },
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
        text: 'parse() is synchronous, while safeParse() returns a Promise that you have to await',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'parse() checks only the types, while safeParse() also runs refinements such as .refine()',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'parse() throws a ZodError on bad data; safeParse() returns { success, data } or { success, error }',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'safeParse() strips keys the schema does not list and parse() keeps them; both throw on bad data',
        isCorrect: false,
      },
    ],
    explanation:
      '`parse()` returns the parsed data or throws a `ZodError`. `safeParse()` never throws: it returns `{ success: true, data }` or `{ success: false, error }`, so a Server Action can check `success` and return the field errors to the form instead of crashing. Both are synchronous (the Promise versions are `parseAsync()` and `safeParseAsync()`, needed only for async refinements), both run every check, refinements and transforms included, and both drop keys a `z.object()` does not list. Use `parse()` where bad data is a bug that should stop the code, and `safeParse()` where bad input is expected, as with a form.',
    hints: [
      'Think about try/catch versus a result object',
      'Which one suits a Server Action that has to send errors back to the form?',
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
        text: 'When a form has many fields and you want it to stop re-rendering on every keystroke',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'When a <select> takes its options from an array and the chosen one has to be validated',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'When a group of checkboxes sharing one name must submit an array of the ticked values',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'When the user can add and remove rows, such as several phone numbers, each with its own inputs',
        isCorrect: true,
      },
    ],
    explanation:
      '`useFieldArray({ control, name: "phones" })` manages a list of rows whose length changes: it returns `fields` (each with a stable `id` for the React `key`) and `append`, `remove`, `insert`, `move` and `swap`, and each row\'s inputs are registered by index, as `phones.0.number`, `phones.1.number` and so on. Zod checks the whole list with `z.array(...)`. The other cases need no extra hook: registered inputs are already uncontrolled, so a long form does not re-render on each keystroke; a `<select>` built from an array is still one registered field; and checkboxes registered under one name already submit an array of the ticked values.',
    hints: [
      'Think about forms where the number of inputs is not fixed',
      'Consider a form where users can add another address',
    ],
    tags: ['react-hook-form', 'useFieldArray', 'dynamic-forms', 'forms'],
    concepts: ['forms-rhf-controller'],
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
      'Complete the schema-level check: the method chained after z.object() that runs a custom check across two fields, and the option that attaches its error to one field.',
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
      '`.refine()` on the object receives the whole object, so it is where one field can be compared with another. It runs once every field has the right type, even when a field\'s own check fails: a 3-letter password that does not match gets both the `.min(8)` message and "Passwords do not match". A missing field (undefined) stops it. `path` names the field the error belongs to, so the message shows next to confirmPassword instead of as an error for the whole form.',
    hints: [
      'The method for a custom check that can see several fields',
      'The option that names the field the error is attached to',
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
      'Complete the schema: FormData.get() always returns a string, so age and birthDate need to be coerced into a number and a Date before Zod checks them.',
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
      '`z.coerce.number()` runs `Number(value)` before its checks, and `z.coerce.date()` runs `new Date(value)`, so the strings FormData hands you become the types the rest of the schema expects. Without coerce, "25" fails a plain `z.number()` because it is a string. Watch the empty box: `Number("")` is 0, so an empty age passes `.min(0)` (use `.min(1)` when 0 is not a real answer), while `new Date("")` is an invalid date, which `z.coerce.date()` rejects.',
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
      { id: 'a', text: 'formData.get() returns a string (or a File, or null), so z.number() rejects it; z.coerce.number() runs Number(value) first', isCorrect: true },
      { id: 'b', text: 'The value is a string, so the field should be z.string().min(0), which then keeps the age at 0 or more', isCorrect: false },
      { id: 'c', text: 'Use safeParseAsync(), since the form data has not finished arriving when the synchronous safeParse() runs', isCorrect: false },
      { id: 'd', text: 'Give the input type="number", so the browser sends a number and z.number() accepts it without a schema change', isCorrect: false },
    ],
    explanation: '`formData.get()` returns a string, a `File` for a file input, or `null` when the field is missing, whatever the input\'s `type` attribute says: `<input type="number">` still sends "25". `z.number()` rejects any string, even one holding digits. `z.coerce.number()` runs `Number(value)` first and then the checks chained after it, so "25" becomes 25 and passes `.min(0)`. `z.string().min(0)` would let it through, but as a string, and `.min()` on a string counts characters, so "-5" and "abc" pass too. The form data has fully arrived by the time the action runs; `safeParseAsync()` is only for async refinements.',
    hints: [
      'Check what formData.get() actually returns, not what the input\'s type attribute suggests',
      'z.coerce runs a JavaScript conversion before the checks',
    ],
    tags: ['zod', 'z-coerce', 'formdata', 'server-actions'],
    concepts: ['forms-zod-schema'],
  },

  // Predict: what safeParse returns for form strings, with and without z.coerce
  {
    id: 'next-forms-coerce-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'A form hands its values over as strings, the way `formData.get()` does. `z` is imported from `zod`. What do the two `console.log` calls print? Type the two lines exactly as printed: `true` or `false`, a space, then the failing field names separated by a comma and a space on the first line, and the JSON on the second.',
    code: `const loan = z.object({
  copies: z.number(),
  weeks: z.coerce.number().max(4),
});

const a = loan.safeParse({ copies: "2", weeks: "6" });
const b = loan.safeParse({ copies: 2, weeks: "3" });

console.log(a.success, a.error?.issues.map((i) => i.path[0]).join(", "));
console.log(b.success, JSON.stringify(b.data));`,
    expectedOutput: `false copies, weeks
true {"copies":2,"weeks":3}`,
    explanation: '`safeParse` never throws: it returns `{ success: false, error }` with one issue per failing check, in field order, or `{ success: true, data }`. In `a`, `copies` is the string `"2"`, and a plain `z.number()` rejects any string, even one holding digits. `weeks` is coerced first, `Number("6")` gives 6, and the coerced number still has to pass `.max(4)`, so it fails too. In `b` both fields pass, and `data` holds the parsed values, so `weeks` comes back as the number 3, not the string `"3"`.',
    hints: [
      'Does `z.number()` accept a string that holds digits?',
      '`z.coerce.number()` converts first, then runs every check chained after it on the number',
    ],
    tags: ['zod', 'safeparse', 'z-coerce', 'formdata', 'predict'],
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
    question: 'EditProfileForm gets `user` as a prop from its Server Component page, so the record is there on the first render. It calls `useForm()` with no options, and each input gets both `{...register("name")}` and `value={user.name}` (and the same for email). The boxes show the user\'s data, but typing into them changes nothing. What is the fix?',
    options: [
      { id: 'a', text: 'Replace register() with a useState per field, since useForm cannot start from values that already exist', isCorrect: false },
      { id: 'b', text: 'Add `mode: "onChange"` to useForm, so the form re-renders on each keystroke and the value prop follows it', isCorrect: false },
      { id: 'c', text: 'Remove the value props and pass `useForm({ defaultValues: user })`, so RHF seeds the inputs itself', isCorrect: true },
      { id: 'd', text: 'Add `key={user.id}` to each input, so React remounts it and the value prop stops overriding the typing', isCorrect: false },
    ],
    explanation: '`register()` leaves an input uncontrolled: React Hook Form reads it through its ref and does not re-render the form on a keystroke. A `value` prop makes React control the input instead, and since nothing ever changes `user.name`, React puts the old text back after every key. `defaultValues` is React Hook Form\'s way to seed a form: the inputs start with the record\'s values and stay uncontrolled, so typing works and the submit gets the edits. `mode` only sets when validation runs, `key` remounts the input but the fixed `value` still wins, and moving to useState throws away what React Hook Form does for you. `defaultValues` is read on the first render only; when the record is fetched in the browser after the form mounts, pass it as `values: user` (or call `reset(user)` when it arrives), or the boxes stay empty.',
    hints: [
      'What does a `value` prop do to an input when nothing ever changes that value?',
      'useForm has an option for the values a form starts with',
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
      'Complete the form: take out and call the function that subscribes to the bio field\'s live value for a character counter, and call the one that clears the form back to its defaultValues after a successful submit.',
    template: `const { register, handleSubmit, ___, reset } = useForm({
  defaultValues: { bio: "" },
});
const bio = ___("bio"); // shown as {bio.length}/160

const onSubmit = async (data) => {
  await saveProfile(data);
  ___();
};`,
    blanks: ['watch', 'watch', 'reset'],
    solution: `const { register, handleSubmit, watch, reset } = useForm({
  defaultValues: { bio: "" },
});
const bio = watch("bio"); // shown as {bio.length}/160

const onSubmit = async (data) => {
  await saveProfile(data);
  reset();
};`,
    explanation:
      '`watch("bio")` returns the field\'s current value and re-renders the component as the user types, which is what a live counter or preview needs; a registered input alone does not re-render anything. `reset()` with no arguments puts every field back to its `defaultValues`, the usual way to clear a form after a successful submit. The default of "" matters here: with no default, `watch("bio")` gives `undefined` on the first render, and again after `reset()`, so `bio.length` would throw.',
    hints: [
      'The function that subscribes to a field\'s current value (it fills two blanks)',
      'The function that puts the form back to its defaults',
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
    question: `Build a CommentForm component with React Hook Form and one registered "comment" textarea.

Requirements:
- Give comment a default value of an empty string
- Use watch("comment") (or useWatch) to show a live character count below the textarea, as "42/280"
- Disable the submit button while the comment is empty
- On submit, await the async prop postComment(data), then call reset() to clear the form`,
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
}
# OR
"use client";
import { useForm, useWatch } from "react-hook-form";

function CommentForm({ postComment }) {
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { comment: "" },
  });

  const comment = useWatch({ control, name: "comment" });

  async function onSubmit(data) {
    await postComment(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea {...register("comment")} />
      <span>{comment.length}/280</span>
      <button type="submit" disabled={!comment}>
        Post
      </button>
    </form>
  );
}`,
    requires: [
      /defaultValues\s*:\s*\{\s*comment\s*:\s*(""|''|``)/,
      /register\(\s*["']comment["']\s*\)/,
      /watch\(\s*["']comment["']\s*\)|useWatch\(/,
      /\/\s*280/,
      /disabled=\{/,
      /handleSubmit\(/,
      /await\s+postComment\(/,
      /reset\(/,
    ],
    explanation:
      '`watch("comment")` returns the field\'s current value and re-renders the component on every keystroke, which a live counter needs; a registered textarea alone never re-renders anything. `useWatch({ control, name: "comment" })` does the same and limits the re-render to the component that calls it. The empty-string default matters: without it, the value is `undefined` on the first render, so `comment.length` throws. Calling `reset()` after `await postComment(data)` resolves puts every field back to its `defaultValues`, so the textarea clears and the button is disabled again, with no state of your own and no page reload.',
    hints: [
      'watch("fieldName") returns the current value and subscribes to updates',
      'reset() with no arguments goes back to defaultValues',
      'Call reset() after the awaited postComment, inside the submit handler',
    ],
    tieredHints: {
      apiSignature: 'useForm({ defaultValues }) returns { register, handleSubmit, watch, reset }; watch(name) returns the live value',
      skeleton: 'function CommentForm({ postComment }) {\n  const { register, handleSubmit, watch, reset } = useForm({ defaultValues: ____ });\n  const comment = ____;\n\n  const onSubmit = async (data) => {\n    ____;\n    ____;\n  };\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <textarea {...register("comment")} />\n      <span>____/280</span>\n      <button disabled={____}>Post</button>\n    </form>\n  );\n}',
    },
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
    question: 'A UI library\'s `<CustomSelect>` takes `value` and `onValueChange(value)` props and passes no ref to a DOM element. You spread `{...register("country")}` onto it, as on a plain `<input>`. Picking an option shows no error, but the submitted data has no country. Why, and what is the fix?',
    options: [
      { id: 'a', text: 'Wrap CustomSelect in forwardRef so register\'s ref reaches it; RHF then reads the picked value from the ref', isCorrect: false },
      { id: 'b', text: 'Set useForm({ mode: "onChange" }), since register only records a value when RHF validates on each change', isCorrect: false },
      { id: 'c', text: 'Add country to defaultValues, since RHF leaves a field out of the submitted data when it has no default', isCorrect: false },
      { id: 'd', text: 'register passes an onChange and a ref that CustomSelect never uses; use <Controller> with field.onChange', isCorrect: true },
    ],
    explanation: '`register("country")` returns `{ name, ref, onChange, onBlur }` for a native element: React Hook Form reads the value from the DOM element through the ref and from the change event. CustomSelect has no `onChange` prop and puts the ref on nothing, so the pick never reaches the form and the submitted data has no country. `<Controller name="country" control={control} render={({ field }) => <CustomSelect value={field.value} onValueChange={field.onChange} />} />` keeps the value in React Hook Form, and `field.onChange` accepts the picked value itself. A ref still reads nothing (in React 19 `ref` is a plain prop, so forwardRef is not even needed to pass one), `mode` only sets when validation runs, and `defaultValues` only seeds the starting value. A component that calls `onChange` with a plain value instead of an event breaks `register` the other way: its handler throws reading `event.target`.',
    hints: [
      'Think about what register() needs from the element it is spread onto',
      'Which prop does CustomSelect actually call when the user picks?',
    ],
    tags: ['react-hook-form', 'Controller', 'register', 'ui-library-integration'],
    concepts: ['forms-rhf-controller'],
  },

  // =====================================================================
  // NEXT_TESTING (25 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze): lower-load scaffold before cold coding
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
      'jest.fn() makes a mock function that records its calls, so the test can pass it as onClick and assert on it; jest.mock("./module") replaces a whole module and returns nothing to pass as a prop. The mock comes first because render needs it as a prop, and render comes before the query because screen finds only what is rendered. fireEvent.click dispatches one click event on the button (fireEvent.press belongs to React Native Testing Library, not the DOM one). getByRole("button") finds the button the way a screen reader does. it and test are the same function in Jest.',
    hints: [
      'jest.fn() makes a mock function; jest.mock() replaces a module',
      'The DOM Testing Library fires a click with fireEvent.click',
      'render needs the mock as a prop, and screen finds only what is rendered',
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
      'Complete the test: find the button by its role and accessible name with the query that throws when it is missing, then fire a click event on it.',
    template: `render(<Button>Submit</Button>);
const button = screen.___("button", { name: "Submit" });
fireEvent.___(button);`,
    blanks: ['getByRole', 'click'],
    solution: `render(<Button>Submit</Button>);
const button = screen.getByRole("button", { name: "Submit" });
fireEvent.click(button);`,
    explanation:
      'getByRole is the query React Testing Library recommends first: it finds an element by its role and accessible name, as a screen reader does, and throws when there is no match, so a missing button fails the test right there. queryByRole would also return the button, but it is for checking that something is absent, since it returns null instead of throwing. fireEvent.click dispatches one click event on the element.',
    hints: [
      'The getBy* query that finds an element by its role',
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
      'jest.fn() returns a mock function that records every call. After the click, toHaveBeenCalled() passes when the mock ran at least once; use toHaveBeenCalledTimes(1) when the exact count matters, or toHaveBeenCalledWith(...) to check the arguments. The old alias toBeCalled() was removed in Jest 30.',
    hints: [
      'The Jest function that makes a mock function',
      'The matcher that checks a mock function was called',
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
      'Write Jest + React Testing Library tests for a Button component imported from "./Button". Button takes children (its text), onClick and disabled, and renders a <button>. Render it with the text "Click me" and write three tests: 1) the button shows its text, 2) clicking it calls onClick once, 3) clicking it while disabled does not call onClick. Use render, screen, fireEvent.click and jest.fn().',
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
});
# OR
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  test("shows its text", () => {
    render(<Button onClick={jest.fn()}>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(onClick).toHaveBeenCalled();
  });

  test("does not call onClick when disabled", () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick} disabled={true}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});`,
    requires: [
      /toBeInTheDocument\(\)|toHaveTextContent\(/,
      /(?:fireEvent|user|userEvent)\.click\([\s\S]*(?:fireEvent|user|userEvent)\.click\(/,
      /(?<!not)\.toHaveBeenCalled(?:\(\)|Times\(\s*1\s*\))/,
      /<Button[^>]*\bdisabled\b/,
      /\.not\.toHaveBeenCalled\(\)|toHaveBeenCalledTimes\(\s*0\s*\)/,
    ],
    explanation:
      'React Testing Library tests what a user sees: getByRole("button", { name: "Click me" }) finds the button by its role and accessible name, as a screen reader does, and getByText("Click me") finds it by its text. jest.fn() makes a mock function that records its calls, so the test can check it ran once (toHaveBeenCalledTimes(1)) or never (not.toHaveBeenCalled()). fireEvent.click dispatches one click event. On a disabled button React does not run onClick, so the third test passes only if Button really passes disabled through to the <button>. A Button that drops the prop fails it, which is the bug this test exists to catch.',
    hints: [
      'Use screen.getByRole("button", { name: "text" }) to find buttons accessibly',
      'jest.fn() creates a spy you can assert on with toHaveBeenCalled()',
      'Disabled buttons should not fire click handlers',
    ],
    tieredHints: {
      apiSignature: 'describe("Button", () => { it("renders/clicks/disabled", () => { ... }) })',
      skeleton: `describe("Button", () => {
  it("calls onClick when clicked", () => {
    const handleClick = jest.____();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).____();
  });

  it("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} ____>Click me</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});`,
    },
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
      'Write a test for a UserProfile component imported from "./UserProfile". On mount it calls fetch("/api/users/1"), shows "Loading..." until the response arrives, then shows the user\'s name in an <h1>. Jest\'s jsdom environment has no fetch, so set global.fetch to a jest.fn() that resolves to a response whose json() resolves to { name: "Alice", email: "alice@test.com" }. In one async test, check that "Loading..." shows first, wait for "Alice" with a findBy query, and check that fetch was called with "/api/users/1".',
    starterCode: `import { render, screen } from "@testing-library/react";
import { UserProfile } from "./UserProfile";

describe("UserProfile", () => {
});`,
    testCases: [
      {
        input: 'Async component test',
        expectedOutput: 'jest.fn mock fetch, getByText for loading, findBy for the name, fetch called with the URL',
        description: 'Should mock fetch and test the loading and loaded states',
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
    );
  });

  it("shows Loading... and then the user's name", async () => {
    render(<UserProfile />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    const userName = await screen.findByRole("heading", { name: "Alice" });
    expect(userName).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith("/api/users/1");
  });
});
# OR
import { render, screen } from "@testing-library/react";
import { UserProfile } from "./UserProfile";

describe("UserProfile", () => {
  test("shows Loading... and then the user's name", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ name: "Alice", email: "alice@test.com" }),
    });
    render(<UserProfile />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/users/1");
  });
});`,
    requires: [
      /(?:global|globalThis|window)\.fetch\s*=\s*jest\.fn\(/,
      /Alice/,
      /getByText\(\s*["'`]Loading\.\.\.["'`]|getByText\(\s*\/Loading/,
      /await\s+(?:screen\.)?findBy\w+\(/,
      /toHaveBeenCalledWith\(\s*["'`]\/api\/users\/1["'`]\s*\)/,
    ],
    explanation:
      'An async component needs two things in its test: a stand-in for the data source and a wait for the screen to change. Jest\'s jsdom environment has no fetch, so the test assigns global.fetch a jest.fn() that resolves to an object with a json() method, which is all the component reads. "Loading..." is on screen as soon as render returns, so getByText finds it at once. The name appears only after the two promises settle, so the test awaits findByRole or findByText, which retries until a match appears (1000 ms by default); getByText("Alice") at that point would throw. Keep both checks in one async test: a test that ends while the fetch is still pending lets the component update after it, and React logs a "not wrapped in act(...)" warning. jest.restoreAllMocks() would not undo the assignment either, since it restores only spies made with jest.spyOn; beforeEach puts a fresh mock in place for every test instead.',
    hints: [
      'global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(data) }))',
      'getByText for what is there at once, await findBy* for what appears later',
      'toHaveBeenCalledWith checks the URL fetch was called with',
    ],
    tieredHints: {
      apiSignature: 'it("shows loading, then data", async () => { ... })',
      skeleton: `beforeEach(() => {
  global.fetch = jest.____(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ name: "Alice" }) })
  );
});

it("shows Loading... and then the user's name", async () => {
  render(<UserProfile />);
  expect(screen.getByText("Loading...")).____();
  const userName = await screen.____("Alice");
  expect(userName).toBeInTheDocument();
  expect(global.fetch).____("/api/users/1");
});`,
    },
    tags: ['jest', 'react-testing-library', 'async', 'fetch', 'mock'],
    concepts: ['testing-rtl-queries', 'testing-async', 'js-promises-async'],
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
        text: 'getByText throws when nothing matches, queryByText returns null, and findByText returns a promise that retries until the text appears',
        isCorrect: true,
      },
      {
        id: 'b',
        text: 'getByText waits up to 1000 ms for the text, queryByText looks once and returns null, and findByText returns every match as an array',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'getByText and queryByText both throw when nothing matches; findByText returns null instead, so it is the one for checking absence',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'They act the same when nothing matches and differ only in matching: exact text for getByText, any substring for queryByText',
        isCorrect: false,
      },
    ],
    explanation:
      'The three prefixes differ only in what happens when the match is missing; all of them match text the same way, exact by default or with a regex. getBy* looks once and throws when there is no match (or more than one), which suits something that should be on screen now. queryBy* looks once and returns null instead, which is how a test checks that something is absent: expect(screen.queryByText("Error")).not.toBeInTheDocument(). findBy* returns a promise that retries the query until it matches, and rejects after 1000 ms by default, which suits text that appears after a fetch, a timer or an effect. The arrays come from the getAllBy*, queryAllBy* and findAllBy* forms.',
    hints: [
      'What does each one do when there is no match?',
      'Which one would you use to check that an error message is not shown?',
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
        text: 'getByRole is faster, since it reads the accessibility tree the browser has already built where getByTestId walks the whole DOM',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'A role query finds an element as users and screen readers do, by its role and name, so it also fails when that role or name breaks',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'getByTestId finds nothing in a Next.js app, since the compiler strips data-testid attributes from every page by default',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'getByRole matches on the text alone, so it keeps passing through markup changes that break a test id when it is renamed',
        isCorrect: false,
      },
    ],
    explanation:
      'Testing Library\'s guiding principle is "the more your tests resemble the way your software is used, the more confidence they can give you." Users and screen readers find elements by their role (button, textbox, heading) and accessible name, never by a data-testid. getByRole("button", { name: "Submit" }) passes only when the element is a button and its name is "Submit": change the <button> to a clickable <div>, or drop the label from an icon button, and the test fails, which is a real accessibility bug caught. getByTestId would still pass. Role queries are not faster (they are the slowest queries, since they compute roles and names), and Next.js keeps data-testid unless you opt in to removing it. Use getByTestId only as a last resort, for an element with no role or text.',
    hints: [
      'Think about how a screen reader user navigates a page',
      'If a <button> became a <div>, which query would notice?',
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
      'Write a test for a ContactForm component imported from "./ContactForm". It has three labelled fields, "Name" (a text input), "Email" (an email input) and "Message" (a textarea), and a "Submit" button; on submit it calls its onSubmit prop with { name, email, message }. Pass a jest.fn() as onSubmit, fill the fields with "John", "john@test.com" and "Hello" using fireEvent.change, submit the form, and assert that onSubmit was called with { name: "John", email: "john@test.com", message: "Hello" }.',
    starterCode: `import { render, screen, fireEvent } from "@testing-library/react";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
});`,
    testCases: [
      {
        input: 'Form submission test',
        expectedOutput: 'fireEvent.change for each field, submit, expect onSubmit called with the data',
        description: 'Should fill the fields and check the submit handler receives the entered data',
      },
    ],
    solution: `import { render, screen, fireEvent } from "@testing-library/react";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  it("calls onSubmit with form data when submitted", () => {
    const handleSubmit = jest.fn();
    render(<ContactForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Hello" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(handleSubmit).toHaveBeenCalledWith({
      name: "John",
      email: "john@test.com",
      message: "Hello",
    });
  });
});
# OR
import { render, screen, fireEvent } from "@testing-library/react";
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
    requires: [
      /jest\.fn\(/,
      /(?:fireEvent\.change|user\.type)\([\s\S]*(?:fireEvent\.change|user\.type)\([\s\S]*(?:fireEvent\.change|user\.type)\(/,
      /fireEvent\.(?:click|submit)\(|user\.click\(/,
      /toHaveBeenCalledWith\(\s*\{[\s\S]*John[\s\S]*\}\s*\)/,
      /john@test\.com/,
      /Hello/,
    ],
    explanation:
      'This test drives the form the way a user does and checks only what comes out. getByLabelText("Email") finds a field by its label, as a screen reader does, and getByRole("textbox", { name: /email/i }) finds the same field, since email inputs and textareas both have the textbox role. fireEvent.change(field, { target: { value: "..." } }) sets the field\'s value and fires the change event that React\'s onChange listens for. Clicking the Submit button inside the form makes the browser fire the form\'s submit event, and fireEvent.submit on the form does the same. toHaveBeenCalledWith compares the argument by value, so the test passes only when every field reached onSubmit. Testing the form as a whole like this is an integration test: it would catch a field whose onChange is wired to the wrong state.',
    hints: [
      'fireEvent.change(field, { target: { value: "..." } }) sets a field\'s value',
      'getByLabelText("Email") finds a field by its label',
      'toHaveBeenCalledWith({ ... }) checks the object onSubmit received',
    ],
    tieredHints: {
      apiSignature: 'fireEvent.change(field, { target: { value } }); expect(fn).toHaveBeenCalledWith(obj)',
      skeleton: `it("calls onSubmit with form data when submitted", () => {
  const handleSubmit = jest.fn();
  render(<ContactForm onSubmit={____} />);

  fireEvent.____(screen.getByLabelText("Name"), {
    target: { value: "John" },
  });
  // ... the same for Email and Message

  fireEvent.click(screen.getByRole("____", { name: "Submit" }));
  expect(handleSubmit).____({ /* the three values */ });
});`,
    },
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
    question: 'What does Mock Service Worker (MSW) do, and why use it instead of jest.mock("./api") to fake an API?',
    options: [
      {
        id: 'a',
        text: 'It records the real API\'s responses on the first run and replays them later, so a test needs the real server only once',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'It swaps fetch for a jest.fn() for you, so it is jest.mock with less setup, and it runs the same code paths that jest.mock does',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'It answers your code\'s real fetch call with your handlers, so the URL, headers and response parsing in your code are tested too',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'It starts a real HTTP server on a port for each test file, so the app has to be set to call localhost while the tests run',
        isCorrect: false,
      },
    ],
    explanation:
      'jest.mock("./api") replaces your API module with a fake, so the fetch inside it never runs: a wrong URL, a missing header or a response parsed the wrong way all pass. With MSW your code makes its real fetch call, and MSW answers it from handlers such as http.get("/api/users", () => HttpResponse.json(data)). In the browser it does that from a service worker; under Jest, setupServer from "msw/node" intercepts requests inside the Node process, so despite its name it opens no port and the app needs no special URL. MSW does not record anything: every response comes from a handler you wrote. The same handlers can serve the browser in development and Storybook too.',
    hints: [
      'Think about what jest.mock skips: the request itself',
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
      'Write Mock Service Worker (MSW 2) handlers for a users API with http.get, http.post and HttpResponse from "msw", and export them as an array named handlers. GET /api/users answers with the JSON array [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]. POST /api/users reads the JSON body, a new user such as { name: "Cara" }, and answers with that user plus id 3, with status 201; the id must be 3 even if the body sends one. request.json() is not typed for you, so type the body as { name: string } before you spread it.',
    starterCode: `import { http, HttpResponse } from "msw";

export const handlers = [];`,
    testCases: [
      {
        input: 'MSW handlers',
        expectedOutput: 'http.get and http.post with HttpResponse.json, status 201 for the POST',
        description: 'Should define GET and POST handlers returning the right JSON and status',
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
    const body = (await request.json()) as { name: string };
    return HttpResponse.json({ ...body, id: 3 }, { status: 201 });
  }),
];
# OR
import { http, HttpResponse } from "msw";

type NewUser = { name: string };

export const handlers = [
  http.get("/api/users", () =>
    HttpResponse.json([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ])
  ),

  http.post<never, NewUser>("/api/users", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...body, id: 3 }, { status: 201 });
  }),
];`,
    requires: [
      /http\.get\(\s*["'`]\/api\/users["'`]/,
      /http\.post(?:<[^>]*>)?\(\s*["'`]\/api\/users["'`]/,
      /HttpResponse\.json\(/,
      /Alice[\s\S]*Bob/,
      /request\.json\(\)/,
      /status:\s*201/,
      /id:\s*3/,
    ],
    explanation:
      'In MSW 2 a handler pairs a method and a path with a resolver: http.get(path, resolver) and http.post(path, resolver). The resolver gets { request, params, cookies } and returns a Response, and HttpResponse.json(data, { status }) builds one with a JSON body, status 200 unless you pass another. For the POST, await request.json() reads the body. Its type is MSW\'s loose DefaultBodyType, which may not be an object, so spreading it is a TypeScript error until you narrow it: cast the result, or type the handler as http.post<never, NewUser> (the first type argument is the path params, the second the body). Put the spread first, { ...body, id: 3 }: written as { id: 3, ...body }, a body that sends its own id overrides the 3. The handlers go to setupServer(...handlers) under Jest or setupWorker(...handlers) in the browser.',
    hints: [
      'http.get("/api/users", () => HttpResponse.json(data)) answers a GET',
      'HttpResponse.json(data, { status: 201 }) sets the status',
      'await request.json() reads the POST body; spread it before id: 3',
    ],
    tieredHints: {
      apiSignature: 'http.post(path, async ({ request }) => Response); HttpResponse.json(body, init?: { status?: number })',
      skeleton: `export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.____([ /* the two users */ ]);
  }),

  http.____("/api/users", async ({ request }) => {
    const body = (await request.____()) as { name: string };
    return HttpResponse.json({ ...____, id: 3 }, { ____ });
  }),
];`,
    },
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
    question: 'What does the "Testing Trophy" recommend about where to spend testing effort?',
    options: [
      {
        id: 'a',
        text: 'Most effort on unit tests at the wide base, as in the test pyramid, since they are the fastest to run and the cheapest to fix',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Most effort on end-to-end tests at the top, since a real browser catches every bug that the layers below it could catch',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Equal effort on every layer, so static analysis, unit, integration and end-to-end tests each get about a quarter',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Most effort on integration tests, the widest band, above static analysis and unit tests, with a few end-to-end tests on top',
        isCorrect: true,
      },
    ],
    explanation:
      'The Testing Trophy, from Kent C. Dodds, reshapes the older test pyramid, whose wide base is unit tests. From the bottom up: static analysis (TypeScript, ESLint) catches typos and type errors for almost nothing; unit tests check isolated logic such as pure functions; integration tests, the widest band, render a component with its children and check what the user sees, as React Testing Library tests do; and a few end-to-end tests (Playwright) cover the flows that matter most. Integration tests get the most effort because they give the most confidence for their cost: many bugs sit where components meet, which a unit test never exercises, while end-to-end tests are the slowest to run and the hardest to keep stable.',
    hints: [
      'Where do many real bugs sit: inside one function, or where components meet?',
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
      'Write tests for a useCounter custom hook imported from "./useCounter". It returns { count, increment, decrement }, and count starts at 0. Test that 1) count starts at 0, 2) increment on a fresh hook makes it 1, and 3) decrement on a fresh hook makes it -1. Use renderHook from @testing-library/react, read the values from result.current, and wrap each call that changes state in act().',
    starterCode: `import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
});`,
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
});
# OR
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

test("starts at 0", () => {
  const { result } = renderHook(() => useCounter());
  expect(result.current.count).toBe(0);
});

test("increment adds 1", () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});

test("decrement takes 1 away", () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.decrement());
  expect(result.current.count).toBe(-1);
});`,
    requires: [
      /renderHook\(/,
      /^(?![\s\S]*=\s*useCounter\()/,
      /result\.current\.count/,
      /act\(\s*\(\)\s*=>\s*\{?\s*result\.current\.increment\(\)/,
      /act\(\s*\(\)\s*=>\s*\{?\s*result\.current\.decrement\(\)/,
      /-\s*1\b/,
    ],
    explanation:
      'A hook can only run inside a component, so renderHook renders a small test component that calls it. result.current holds the hook\'s latest return value, and it is replaced on every render, so read it again after each change instead of keeping an old copy. act() makes React apply the state update and re-render before it returns; call increment() outside act and result.current.count is still 0 on the next line, and React logs a "not wrapped in act(...)" warning. Each test calls renderHook again, so each one starts from a fresh counter at 0, which is why decrement gives -1.',
    hints: [
      'renderHook(() => useCounter()) returns { result }',
      'Access return values with result.current.count',
      'Wrap state-changing calls in act(() => { ... })',
    ],
    tieredHints: {
      apiSignature: 'const { result } = renderHook(() => useCounter())',
      skeleton: `it("starts with count 0", () => {
  const { result } = ____(() => useCounter());
  expect(result.current.____).toBe(0);
});

it("increments the count", () => {
  const { result } = renderHook(() => useCounter());
  ____(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});`,
    },
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
        text: 'RTL for what a component does within one page, such as validation and showing data; Playwright for real-browser flows across pages',
        isCorrect: true,
      },
      {
        id: 'b',
        text: 'Playwright for everything, since jsdom misses so much that RTL tests pass on components that are broken in a real browser',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'RTL for Server Components, which it renders like any other, and Playwright for Client Components, which need a browser',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Either one for any test, since both drive a real browser engine and differ only in the API you write the test with',
        isCorrect: false,
      },
    ],
    explanation:
      'React Testing Library runs in Node against jsdom, a page in memory with no real browser: fast enough to run on every save, and right for a component\'s behaviour within a page, such as validation, interactions and showing fetched data. jsdom has no layout, no real navigation and no server, so it cannot render an async Server Component either. Playwright drives a real browser (Chromium, Firefox, WebKit) against the running app, which is what page navigation, sign-in flows, cookies across pages and cross-browser checks need. Its tests are slower and depend on the whole stack, so keep them for the journeys that matter most. Most apps use both: many RTL tests and a few Playwright ones.',
    hints: [
      'Think about speed against how much of the real app runs',
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
      'Write a Playwright end-to-end test for a login flow (the config sets baseURL to the running app). The test should 1) go to /login, 2) fill the field labelled "Email" with "user@test.com", 3) fill the field labelled "Password" with "password123", 4) click the "Log In" button, 5) expect the URL to become /dashboard, and 6) expect a "Welcome back" heading to be visible. Use page.goto, the getByLabel and getByRole locators, and awaited expect assertions.',
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
});
# OR
import { test, expect } from "@playwright/test";

test("logs in and redirects to dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill("user@test.com");
  await page.getByLabel(/password/i).fill("password123");
  await page.getByRole("button", { name: /log in/i }).click();
  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
});`,
    requires: [
      /page\.goto\(\s*["'`]\/login["'`]/,
      /user@test\.com/,
      /password123/,
      /\.click\(/,
      /await\s+expect\(\s*page\s*\)\.toHaveURL\(/,
      /await\s+expect\([^;]*welcome back[^;]*\)\.toBeVisible\(\)/i,
    ],
    explanation:
      'A Playwright test drives a real browser against the running app, so it covers what jsdom cannot: the server render, hydration, real requests and navigation between pages. page.goto("/login") opens the page relative to baseURL. getByLabel("Email") and getByRole("button", { name: "Log In" }) are locators that find elements as a user does, like React Testing Library\'s queries, and each action on a locator (fill, click) waits until the element is ready. The older page.fill(selector) and page.click(selector) still work, but locators are what the docs recommend. Assertions such as expect(page).toHaveURL("/dashboard") and toBeVisible() retry until they pass or time out (5 seconds by default), so the test waits for the redirect without any manual delay; they return promises, so each one needs await, or the test can finish before they check anything.',
    hints: [
      'Locators and expect assertions wait on their own; no manual delays',
      'Use getByLabel and getByRole for accessible locators',
      'expect(page).toHaveURL() waits for navigation',
    ],
    tieredHints: {
      apiSignature: 'test("title", async ({ page }) => { ... })',
      skeleton: `test("login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("____").fill("user@test.com");
  await page.getByRole("button", { name: /log in/i }).____();
  await expect(page).toHaveURL(____);
});`,
    },
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
    question: 'A Client Component calls useRouter() from "next/navigation" and runs router.push("/dashboard") when you click Save. Why does its Jest test need jest.mock("next/navigation")?',
    options: [
      {
        id: 'a',
        text: 'Without it, router.push really changes jsdom\'s URL, so the later tests in the same file start on /dashboard instead of /',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Outside a Next.js app useRouter() has no router to read and throws, and the mock also lets the test check what push received',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'jest.mock turns on Next.js\'s test mode, which makes <Link> and useRouter work in jsdom with no further setup needed',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'It is needed only for Server Components that call redirect(); a Client Component\'s useRouter() works in Jest unmocked',
        isCorrect: false,
      },
    ],
    explanation:
      'The hooks in "next/navigation" read context that the Next.js App Router provides, and a plain Jest render has none. useRouter() then throws "invariant expected app router to be mounted", so the component cannot even render; usePathname() and useSearchParams() return null instead, which breaks code that reads them, so mock those too when the component uses them. jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) })) swaps the module for one you control, with const mockPush = jest.fn() at the top of the file (Jest allows a variable whose name starts with mock inside the factory). The test can then click Save and assert expect(mockPush).toHaveBeenCalledWith("/dashboard") without a Next.js server.',
    hints: [
      'What happens when useRouter() runs with no Next.js app around it?',
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
    question: 'A Server Component is async function UserList(), which awaits getUsers() from "./data" and returns a <ul> of names. How can a Jest test with React Testing Library check that list?',
    options: [
      {
        id: 'a',
        text: 'render(<UserList />) like any other component, since React Testing Library waits for an async component to resolve',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Wrap it in <Suspense>, since Suspense makes React Testing Library run the component on the server instead of jsdom',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Mock getUsers, call UserList() as a plain async function, and render the element it returns: render(await UserList())',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'It cannot be tested in Jest at all; only a Playwright test against a running Next.js server can check a Server Component',
        isCorrect: false,
      },
    ],
    explanation:
      'An async Server Component is an async function that returns JSX, and React Testing Library renders on the client, where async components are not supported: render(<UserList />) logs that UserList "is an async Client Component", and whether the list then shows up depends on the setup, even with <Suspense> around it. <Suspense> only shows a fallback while something loads; it never moves rendering to a server. The reliable options are to test the data function on its own, or to call the component yourself: jest.mock("./data") with getUsers resolving to test data, then render(await UserList()) renders the returned <ul>, and screen.getByText("Alice") finds a name. That covers one level only: an async Server Component inside the returned tree is unsupported in the same way, which is why the Next.js docs recommend end-to-end tests with Playwright for those pages. The data layer is what you mock, not React.',
    hints: [
      'A Server Component is an async function; what can a test do with an async function?',
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
    question: 'What is snapshot testing, and when should you avoid it?',
    options: [
      {
        id: 'a',
        text: 'It saves a screenshot of the component and compares pixels, so avoid it for components with animations or web fonts',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'It saves the rendered markup and fails on any change, so it suits big components best, catching changes nobody wrote a test for',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'It records the computed CSS of every element and diffs it, so avoid it while a design system\'s theme still changes often',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'It saves the rendered markup to a file and fails when it changes; avoid it for big, changing components, where diffs get approved unread',
        isCorrect: true,
      },
    ],
    explanation:
      'A Jest snapshot test (toMatchSnapshot or toMatchInlineSnapshot) serializes the rendered markup, saves it the first time, and fails on any later run where it differs. It compares text, not pixels or styles; pixel comparison is a separate tool, such as Playwright\'s toHaveScreenshot. The trouble with a big component that changes often is that every change fails the test, people run jest -u to accept the new snapshots without reading a long diff, and the test passes without anyone checking that the change was meant. Snapshots suit small, stable output such as an icon, a badge or a formatted date, where any change is likely a mistake. For a complex component, assert the behaviour you mean with getByRole or toHaveTextContent.',
    hints: [
      'What happens when a developer sees "15 snapshots failed" after a small change?',
      'Would you carefully review a 500-line snapshot diff?',
    ],
    tags: ['snapshot-testing', 'jest', 'testing-best-practices', 'anti-patterns'],
    concepts: ['testing-rtl-queries'],
  },

  // 15. Coding (JSX): Integration test, UserList with MSW
  {
    id: 'next-testing-15',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Write an integration test for a UserList component imported from "./UserList". On mount it fetches GET /api/users and renders each user\'s name in an <li>; when the response is not ok it shows "Error loading users". With MSW\'s setupServer, answer GET /api/users with [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }], and start, reset and close the server in beforeAll, afterEach and afterAll. Then write two tests: one uses findByText to check that both names appear, and one uses server.use to answer the request with status 500 for that test only and checks that the error text appears.',
    starterCode: `import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { UserList } from "./UserList";
`,
    testCases: [
      {
        input: 'Integration test with MSW',
        expectedOutput: 'setupServer, beforeAll/afterEach/afterAll, render, findByText, server.use for the error',
        description: 'Should mock the API with MSW and test the loaded and error states',
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
});
# OR
import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { UserList } from "./UserList";

const server = setupServer(
  http.get("/api/users", () =>
    HttpResponse.json([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ])
  )
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("lists the users", async () => {
  render(<UserList />);
  expect(await screen.findByText("Alice")).toBeInTheDocument();
  expect(await screen.findByText("Bob")).toBeInTheDocument();
});

test("shows an error when the API fails", async () => {
  server.use(http.get("/api/users", () => HttpResponse.json(null, { status: 500 })));
  render(<UserList />);
  expect(await screen.findByText("Error loading users")).toBeInTheDocument();
});`,
    requires: [
      /setupServer\(/,
      /http\.get\(\s*["'`]\/api\/users["'`]/,
      /beforeAll\([\s\S]{0,40}server\.listen\(/,
      /afterEach\([\s\S]{0,40}server\.resetHandlers\(/,
      /afterAll\([\s\S]{0,40}server\.close\(/,
      /await\s+(?:screen\.)?findBy\w*\(\s*["'`/]Alice/i,
      /await\s+(?:screen\.)?findBy\w*\(\s*["'`/]Bob/i,
      /server\.use\(/,
      /status:\s*500/,
    ],
    explanation:
      'This integration test runs the component, its fetch and its rendering together, with only the network faked. setupServer from "msw/node" intercepts the component\'s real fetch inside the Jest process and answers it from the handler. server.listen() turns that on once before the tests, server.resetHandlers() after each test removes any handler a test added with server.use(), and server.close() turns it off at the end. The first test awaits findByText, which retries until the fetch has resolved and the names are on screen. The second adds a handler that answers 500 for that test only, so the component takes its error path, and afterEach puts the normal handler back. listen({ onUnhandledRequest: "error" }) also fails any test that makes a request no handler matches. Jest\'s own jsdom environment has no fetch, so MSW\'s docs have you run these tests in jest-fixed-jsdom, which keeps Node\'s fetch.',
    hints: [
      'setupServer(handler) creates the server; listen(), resetHandlers() and close() run in the three hooks',
      'await screen.findByText("Alice") waits for the fetch to resolve',
      'server.use(http.get(...)) overrides the handler for one test',
    ],
    tieredHints: {
      apiSignature: 'const server = setupServer(...handlers); beforeAll(() => server.listen()); afterEach(() => server.resetHandlers()); afterAll(() => server.close());',
      skeleton: `const server = setupServer(
  http.get("/api/users", () => HttpResponse.json([{ id: 1, name: "Alice" }]))
);

beforeAll(() => server.____());
afterEach(() => server.____());
afterAll(() => server.____());

describe("UserList", () => {
  it("fetches and displays users", async () => {
    render(<UserList />);
    expect(await screen.findByText("Alice")).toBeInTheDocument();
  });

  it("shows error message when API fails", async () => {
    server.____(/* a GET /api/users handler that answers 500 */);
    // render, then find the error text
  });
});`,
    },
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
      'Complete the test: find the email input by the text of its <label>, with the query that throws when it is missing, then set its value.',
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
      'The getBy* query that matches a field by its <label> text',
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
      'beforeAll runs once before the whole suite, so the server starts listening a single time rather than being torn down and rebuilt per test. afterEach resets any per-test handler overrides (from server.use()) so tests stay isolated from each other. afterAll closes the server once the entire suite finishes. Calling listen() in beforeEach instead does not just waste time: on current MSW 2 the second listen() without a close() throws "cannot configure an already enabled network", so every test after the first fails. resetHandlers() already isolates the tests, which is why it alone runs after each one.',
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
      'Complete the test: create a user-event session, then use it to click the Save button (the call must be awaited).',
    template: `const user = userEvent.___();
render(<Button onClick={handleClick}>Save</Button>);
await user.___(screen.getByRole("button", { name: "Save" }));`,
    blanks: ['setup', 'click'],
    solution: `const user = userEvent.setup();
render(<Button onClick={handleClick}>Save</Button>);
await user.click(screen.getByRole("button", { name: "Save" }));`,
    explanation:
      'userEvent.setup() creates a user for this test, and user.click() fires the whole sequence a real click produces: hover and pointer events, mousedown, focus, mouseup and then click. fireEvent.click fires the click event alone. Every user-event action returns a promise, so await it before you assert; that is what catches bugs that hide in the in-between events, such as an onMouseDown or onFocus handler that fireEvent.click never triggers.',
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
      { id: 'c', text: 'fireEvent.click dispatches one "click" event. userEvent.click fires the sequence a real click makes (pointerdown, mousedown, focus, pointerup, mouseup, click), so it catches handlers that rely on the in-between events, which is why Testing Library\'s docs recommend userEvent', isCorrect: true },
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

  // Predict: what getBy, queryBy and findBy give before and after an async update
  {
    id: 'next-testing-queries-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TESTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'This runs inside an `async` Jest test with jsdom, and `render` and `screen` come from `@testing-library/react`. `Status` shows "Loading", then "Ready" 100 ms after it mounts. What do the `console.log` calls print? Type the printed lines in order, one per line, exactly as printed.',
    code: `function Status() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setTimeout(() => setReady(true), 100);
  }, []);
  return <p>{ready ? "Ready" : "Loading"}</p>;
}

render(<Status />);
console.log(screen.queryByText("Ready"));
try {
  screen.getByText("Ready");
} catch {
  console.log("getByText threw");
}
const p = await screen.findByText("Ready");
console.log(p.textContent, screen.queryByText("Loading"));`,
    expectedOutput: `null
getByText threw
Ready null`,
    explanation: 'Right after `render` the paragraph says "Loading", so nothing matches "Ready". `queryByText` returns `null` when nothing matches, while `getByText` throws, which is why `getBy*` cannot check that something is absent. `findByText` returns a promise and retries the query until it matches or 1000 ms pass, so the `await` resumes once the timer has set `ready`. By then the paragraph\'s text is "Ready", and "Loading" is gone, so the last `queryByText` gives `null` again.',
    hints: [
      'Which query returns a value for no match, and which one throws?',
      '`findByText` keeps retrying until the text appears; what does the paragraph say then?',
    ],
    tags: ['react-testing-library', 'getBy', 'queryBy', 'findBy', 'async', 'predict'],
    concepts: ['testing-rtl-queries', 'testing-async'],
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
      'Complete the assertion: the component calls handleSave 300 ms after the last change (a debounce) and shows no new text, so wait until the mock has been called.',
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
      'findBy* queries help only when you wait for an element to appear. waitFor is more general: it runs the callback again and again until it stops throwing, or fails after 1000 ms by default. A debounced save calls a mock instead of rendering text you could query for, so waitFor around the expect is the right tool, and the 300 ms delay is well inside its timeout. A plain expect right after the change would fail, since the save has not happened yet.',
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
      'Complete the spy: record calls to the real Date.now while it still returns the real time, then put the original method back after the test.',
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
