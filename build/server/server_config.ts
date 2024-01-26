import server_config_json from "./server_config.json" with { type: "json" };

export const server_config = {
    ...server_config_json,
    keymanager_token_path: `/data/data-${server_config_json.network}/validators/api-token.txt`,
    rest_url: "http://localhost:5052",
    keymanager_url: "http://localhost:5062"
}