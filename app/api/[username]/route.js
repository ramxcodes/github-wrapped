import { NextResponse } from "next/server";

async function fetchGitHubData(url, errorMessage) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(errorMessage || `Failed to fetch data from ${url}`);
  }
  return await response.json();
}

export async function GET(request, { params }) {
  const { username } = params;

  try {
    // Fetch profile data
    const profileData = await fetchGitHubData(
      `https://api.github.com/users/${username}`,
      "GitHub user not found"
    );

    // Fetch repositories data
    const reposData = await fetchGitHubData(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      "Failed to fetch repositories"
    );

    // Calculate stats
    let totalStars = 0;
    let totalForks = 0;
    let totalCommits = 0; 
    const languageCount = {};

    for (const repo of reposData) {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      totalCommits += repo.size;

      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
      }
    }

    const sortedLanguages = Object.entries(languageCount).sort(
      (a, b) => b[1] - a[1]
    );
    const mostUsedLanguages = sortedLanguages
      .slice(0, 2)
      .map(([lang]) => lang)
      .join(" and ");

    const estimatedCtrlCVC = totalCommits / 5;
    const estimatedDebugHours = Math.round(totalCommits / 500);
    const estimatedBugCryHours = Math.round(totalCommits / 1500);

    const tiers = ["E", "D", "C", "B", "A", "S"];
    const tierIndex = Math.min(
      Math.floor((totalStars + totalForks) / 10),
      tiers.length - 1
    );
    const userTier = tiers[tierIndex];

    const result = {
      name: profileData.name || username,
      public_repos: profileData.public_repos,
      followers: profileData.followers,
      following: profileData.following,
      total_commits: totalCommits,
      total_stars: totalStars,
      total_forks: totalForks,
      most_used_languages: mostUsedLanguages,
      user_tier: userTier,
      fun_highlights: {
        estimated_ctrl_c_v: estimatedCtrlCVC,
        estimated_debug_hours: estimatedDebugHours,
        estimated_bug_cry_hours: estimatedBugCryHours,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching GitHub Wrap:", error);
    return NextResponse.json(
      { error: "Failed to fetch data or generate GitHub wrap", details: error.message },
      { status: 500 }
    );
  }
}
