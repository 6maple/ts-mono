import { Octokit } from 'octokit';

const owner = '6maple';
const repo = '6maple.github.io';
const issueNumber = 1;
const token =
  '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';

const octokit = new Octokit({
  auth: token,
});

export const getIssueCommentCount = async () => {
  const res = await octokit.request(
    `GET /repos/${owner}/${repo}/issues/${issueNumber}/comments`,
    {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );
  const num = res.data.length;
  return num;
};

export const addIssueCountComment = async (num: number) => {
  await octokit.request(
    `POST /repos/${owner}/${repo}/issues/${issueNumber}/comments`,
    {
      body: `[${num}]#${new Date().toLocaleString()}`,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );
};
