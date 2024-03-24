import axios from "axios";

async function registerGithubCommitWebhook(
  owner: string,
  repo: string,
  token: string
) {
  const res = await axios.post(
    `https://api.github.com/repos/${owner}/${repo}/hooks`,
    {
      owner,
      repo,
      name: "web",
      active: true,
      events: ["push"],
      config: {
        url: "https://example.com/webhook",
        content_type: "json",
        insecure_ssl: "0",
      },
    },
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  console.log(res.data);
}

registerGithubCommitWebhook(
  "Arunjoseph3007",
  "ts-ds",
  process.env.GITHUB_PAT as string
);
