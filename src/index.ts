import axios from "axios";

type TGithubWebhook = {
  type: string;
  id: number;
  name: string;
  active: boolean;
  events: string[];
  config: {
    content_type: string;
    insecure_ssl: string;
    url: string;
  };
  updated_at: string;
  created_at: string;
  url: string;
  test_url: string;
  ping_url: string;
  deliveries_url: string;
  last_response: {
    code?: number;
    status: string;
    message?: string;
  };
};

async function registerGithubCommitWebhook(
  owner: string,
  repo: string,
  token: string
) {
  const res = await axios.post(
    `https://api.github.com/repos/${owner}/${repo}/hooks`,
    {
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
  return (res.data.id as number).toString();
}

async function deleteGithubCommitWebhook(
  owner: string,
  repo: string,
  hookId: string,
  token: string
) {
  try {
    const res = await axios.delete(
      `https://api.github.com/repos/${owner}/${repo}/hooks/${hookId}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    console.log(res.status);
    return true;
  } catch (e) {
    return false;
  }
}

async function listGithubCommitWebhooks(
  owner: string,
  repo: string,
  token: string
) {
  const res = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/hooks`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  console.log(res.data);

  return res.data as TGithubWebhook[];
}

// registerGithubCommitWebhook(
//   "Arunjoseph3007",
//   "ts-ds",
//   process.env.GITHUB_PAT as string
// );
listGithubCommitWebhooks(
  "Arunjoseph3007",
  "ts-ds",
  process.env.GITHUB_API
);

// deleteGithubCommitWebhook(
//   "Arunjoseph3007",
//   "ts-ds",
//   "468457014",
//   process.env.GITHUB_PAT as string
// );
