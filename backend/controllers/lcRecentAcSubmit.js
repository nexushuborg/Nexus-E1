const query = `#graphql
query getACSubmissions ($username: String!) {
    recentAcSubmissionList(username: $username) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
    }
}`;

export default query;