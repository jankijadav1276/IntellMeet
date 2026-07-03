export interface ActionItem {
  task: string
  assignee?: string
}

export interface SummaryResponse {
  summary: string
  actionItems: ActionItem[]
}