import axios from "axios";

export type TGithubWebhook = {
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
const WebHooksPayload = {
  ref: "refs/heads/main",
  before: "d21919bb77bb6232a464b738043ef78588db34c1",
  after: "bc0a184d7a9127a8827a8d396a12c6c43ce8e1bc",
  repository: {
    id: 644925108,
    node_id: "R_kgDOJnDGtA",
    name: "ts-ds",
    full_name: "Arunjoseph3007/ts-ds",
    private: false,
    owner: {
      name: "Arunjoseph3007",
      email: "92107769+Arunjoseph3007@users.noreply.github.com",
      login: "Arunjoseph3007",
      id: 92107769,
      node_id: "U_kgDOBX1z-Q",
      avatar_url: "https://avatars.githubusercontent.com/u/92107769?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/Arunjoseph3007",
      html_url: "https://github.com/Arunjoseph3007",
      followers_url: "https://api.github.com/users/Arunjoseph3007/followers",
      following_url:
        "https://api.github.com/users/Arunjoseph3007/following{/other_user}",
      gists_url: "https://api.github.com/users/Arunjoseph3007/gists{/gist_id}",
      starred_url:
        "https://api.github.com/users/Arunjoseph3007/starred{/owner}{/repo}",
      subscriptions_url:
        "https://api.github.com/users/Arunjoseph3007/subscriptions",
      organizations_url: "https://api.github.com/users/Arunjoseph3007/orgs",
      repos_url: "https://api.github.com/users/Arunjoseph3007/repos",
      events_url:
        "https://api.github.com/users/Arunjoseph3007/events{/privacy}",
      received_events_url:
        "https://api.github.com/users/Arunjoseph3007/received_events",
      type: "User",
      site_admin: false,
    },
    html_url: "https://github.com/Arunjoseph3007/ts-ds",
    description: "Typescript Data structures",
    fork: false,
    url: "https://github.com/Arunjoseph3007/ts-ds",
    created_at: 1684938961,
    updated_at: "2023-09-08T17:59:15Z",
    pushed_at: 1711430069,
    homepage: null,
    size: 79,
    stargazers_count: 0,
    watchers_count: 0,
    language: "TypeScript",
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    has_discussions: false,
    forks_count: 0,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: null,
    allow_forking: true,
    is_template: false,
    web_commit_signoff_required: false,
    topics: [],
    visibility: "public",
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: "main",
    stargazers: 0,
    master_branch: "main",
  },
  pusher: {
    name: "Arunjoseph3007",
    email: "92107769+Arunjoseph3007@users.noreply.github.com",
  },
  sender: {
    login: "Arunjoseph3007",
    id: 92107769,
    node_id: "U_kgDOBX1z-Q",
    avatar_url: "https://avatars.githubusercontent.com/u/92107769?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/Arunjoseph3007",
    type: "User",
    site_admin: false,
  },
  created: false,
  deleted: false,
  forced: false,
  base_ref: null,
  compare:
    "https://github.com/Arunjoseph3007/ts-ds/compare/d21919bb77bb...bc0a184d7a91",
  commits: [
    {
      id: "bc0a184d7a9127a8827a8d396a12c6c43ce8e1bc",
      tree_id: "2d6724d7e373d5ccd7e95207e0b6f84b53df1b69",
      distinct: true,
      message: "Update README.md",
      timestamp: "2024-03-26T10:44:29+05:30",
      url: "https://github.com/Arunjoseph3007/ts-ds/commit/bc0a184d7a9127a8827a8d396a12c6c43ce8e1bc",
      author: {
        name: "Arunjoseph3007",
        email: "92107769+Arunjoseph3007@users.noreply.github.com",
        username: "Arunjoseph3007",
      },
      committer: {
        name: "GitHub",
        email: "noreply@github.com",
        username: "web-flow",
      },
      added: [],
      removed: [],
      modified: ["README.md"],
    },
  ],
  head_commit: {
    id: "bc0a184d7a9127a8827a8d396a12c6c43ce8e1bc",
    tree_id: "2d6724d7e373d5ccd7e95207e0b6f84b53df1b69",
    distinct: true,
    message: "Update README.md",
    timestamp: "2024-03-26T10:44:29+05:30",
    url: "https://github.com/Arunjoseph3007/ts-ds/commit/bc0a184d7a9127a8827a8d396a12c6c43ce8e1bc",
    author: {
      name: "Arunjoseph3007",
      email: "92107769+Arunjoseph3007@users.noreply.github.com",
      username: "Arunjoseph3007",
    },
    committer: {
      name: "GitHub",
      email: "noreply@github.com",
      username: "web-flow",
    },
    added: [],
    removed: [],
    modified: ["README.md"],
  },
};
export type IWebHooksPayload = typeof WebHooksPayload;

async function register(owner: string, repo: string, token: string) {
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

async function deleteWebhook(
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

async function list(owner: string, repo: string, token: string) {
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

async function handle(payload: IWebHooksPayload, workflowId: string) {
  console.log({ payload, workflowId });
}

// registerGithubCommitWebhook(
//   "Arunjoseph3007",
//   "ts-ds",
//   process.env.GITHUB_PAT as string
// );
// listGithubCommitWebhooks("Arunjoseph3007", "ts-ds", process.env.GITHUB_API);

// deleteGithubCommitWebhook(
//   "Arunjoseph3007",
//   "ts-ds",
//   "468457014",
//   process.env.GITHUB_PAT as string
// );

export const GithubCommitWebhookController = {
  list,
  delete: deleteWebhook,
  register,
  handle,
};
