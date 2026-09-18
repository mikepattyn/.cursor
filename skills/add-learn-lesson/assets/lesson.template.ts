import type { Lesson } from "./types";

export const exampleLesson: Lesson = {
  id: "example",
  number: 4,
  title: "Short verb phrase",
  summary: "One sentence. What they can do when the lesson is ticked.",
  minutes: 12,
  repo: "mikepattyn/example",
  repoUrl: "https://github.com/mikepattyn/example",
  steps: [
    {
      id: "what",
      title: "What this is",
      why: "Hold the picture before any commands.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "One short paragraph. Name the thing. Say what it is not.",
        },
        {
          type: "flow",
          nodes: [
            { label: "A", hint: "first" },
            { label: "B", hint: "next" },
            { label: "C", hint: "done" },
          ],
        },
        {
          type: "link",
          label: "Open the source repo",
          href: "https://github.com/mikepattyn/example",
        },
      ],
    },
    {
      id: "do",
      title: "Do the one thing",
      why: "This is the step they came for.",
      minutes: 2,
      blocks: [
        {
          type: "p",
          text: "Tell them what to run or what to write. Keep the rest for later steps.",
        },
        {
          type: "code",
          lang: "bash",
          file: "terminal",
          content: "echo 'replace this with a real command from the source repo'",
        },
        {
          type: "caution",
          text: "Only if skipping this would send mail, spend money, or leak a secret.",
        },
      ],
    },
  ],
};
