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
    tieredHints: {
      apiSignature: 'it("displays data", async () => { ... })',
      skeleton: `beforeEach(() => {
  global.fetch = jest.____(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ name: "Alice" }) })
  ) as jest.Mock;
});

it("displays user", async () => {
  render(<UserProfile />);
  expect(screen.getByText("Loading...")).____();
  const userName = await screen.____("Alice");
  expect(userName).toBeInTheDocument();
});`,
    },
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
      'fireEvent.change(input, { target: { value: "..." } }) simulates user typing',
      'fireEvent.click(button) simulates a click event',
      'waitFor(() => expect(...)) retries assertions until they pass or time out',
    ],
    tieredHints: {
      apiSignature: 'describe("ContactForm", () => { it("calls onSubmit with form data", () => { ... }) })',
      skeleton: `describe("ContactForm", () => {
  it("calls onSubmit with form data when submitted", () => {
    const handleSubmit = jest.fn();
    render(<ContactForm onSubmit={handleSubmit} />);

    fireEvent.____(screen.getByRole("textbox", { name: /name/i }), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "john@test.com" },
    });

    fireEvent.click(screen.getByRole("____", { name: /submit/i }));

    expect(handleSubmit).____({
      name: "John",
      email: "john@test.com",
      message: "Hello",
    });
  });
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
    tieredHints: {
      apiSignature: 'HttpResponse.json(body, init?: { status?: number }) -> Response',
      skeleton: `import { http, HttpResponse } from "msw";

export const handlers = [
  http.____("/api/users", () => {
    return ____.____([
      { id: ____, name: "Alice" },
      { id: ____, name: "Bob" },
    ]);
  }),

  http.____("/api/users", async ({ request }) => {
    const body = await request.____();
    return ____.____(
      { id: ____, ...body },
      { ____: ____ }
    );
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
