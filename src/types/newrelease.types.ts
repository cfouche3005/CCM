interface AddProjectBody {
    provider: string
    name: string
    email_notification?: string
    slack_channels?: string[]
    telegram_chats?: string[]
    discord_channels?: string[]
    hangouts_chat_webhooks?: string[]
    microsoft_teams_webhooks?: string[]
    mattermost_webhooks?: string[]
    rocketchat_webhooks?: string[]
    matrix_rooms?: string[]
    webhooks?: string[]
    exclude_version_regexp?: Exclusion[]
    exclude_prereleases?: boolean
    exclude_updated?: boolean
    note?: string
    tags?: string[]
}

interface Exclusion {
    value: string
    inverse: boolean
}

interface Project {
    id: string
    name: string
    provider: string
    url: string
    email_notification?: string
    slack_channels?: string[]
    telegram_chats?: string[]
    discord_channels?: string[]
    hangouts_chat_webhooks?: string[]
    microsoft_teams_webhooks?: string[]
    mattermost_webhooks?: string[]
    rocketchat_webhooks?: string[]
    webhooks?: string[]
    exclude_version_regexp?: Exclusion[]
    exclude_prereleases?: boolean
    exclude_updated?: boolean
    note?: string
    tags?: string[]
}

export {AddProjectBody,Project}