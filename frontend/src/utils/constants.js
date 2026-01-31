export const SENTIMENT_CONFIG = {
  POSITIVE: {
    label: 'Positive',
    color: '#36d7b7',
    background: 'rgba(54, 215, 183, 0.16)',
  },
  NEUTRAL: {
    label: 'Neutral',
    color: '#f2c94c',
    background: 'rgba(242, 201, 76, 0.16)',
  },
  NEGATIVE: {
    label: 'Negative',
    color: '#ff6b6b',
    background: 'rgba(255, 107, 107, 0.2)',
  },
}

export const ACTION_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending approval',
    color: '#f2c94c',
    background: 'rgba(242, 201, 76, 0.18)',
  },
  IN_PROGRESS: {
    label: 'In progress',
    color: '#4fc3f7',
    background: 'rgba(79, 195, 247, 0.18)',
  },
  EXECUTED: {
    label: 'Executed',
    color: '#36d7b7',
    background: 'rgba(54, 215, 183, 0.18)',
  },
}

export const SAMPLE_MESSAGES = [
  {
    id: 'msg-4801',
    customer: 'Northwind Retail',
    channel: 'Email',
    sentiment: 'NEGATIVE',
    content: 'POs are sitting in limbo for the third week. Our finance team has zero visibility into why payments are blocked.',
    owner: 'Risk Ops',
    riskLevel: 'High',
    timestamp: '2026-01-28T14:32:00Z',
  },
  {
    id: 'msg-4802',
    customer: 'Acme Distribution',
    channel: 'Slack Connect',
    sentiment: 'NEUTRAL',
    content: "Need a quick status readout on the automation runbook for tomorrow's rollout. We can brief your CSM in the morning.",
    owner: 'Customer Success',
    riskLevel: 'Medium',
    timestamp: '2026-01-27T19:20:00Z',
  },
  {
    id: 'msg-4803',
    customer: 'Globex Manufacturing',
    channel: 'SMS',
    sentiment: 'POSITIVE',
    content: "Appreciate the fast turnaround on last week's anomaly. Keep us looped in on further signals. Prepared to co-present results.",
    owner: 'Program Office',
    riskLevel: 'Low',
    timestamp: '2026-01-26T11:02:00Z',
  },
]

export const SAMPLE_ACTIONS = [
  {
    id: 'act-9007',
    type: 'Credit hold escalation',
    customer: 'Northwind Retail',
    reason: 'Recurring payment failure triggered an automatic hold on $240K ARR. AI flagged shipment delays beyond SLA.',
    status: 'PENDING',
    owner: 'Finance Ops',
    impact: 'High',
    createdAt: '2026-01-28T15:00:00Z',
    summary: 'If left unresolved, the customer will churn within 48h due to missed replenishment window.',
    draft: 'Team Northwind - pausing hardware shipments until remittance lands. Finance is ready to fast-track once payment clears.',
    metrics: {
      exposure: '$240K ARR',
      riskWindow: '48h',
      playbook: 'Ops-04 Escalate Credit Hold',
    },
  },
  {
    id: 'act-9011',
    type: 'Customer health call',
    customer: 'Acme Distribution',
    reason: 'Sentiment dropped to 0.32 after automation delay; exec sponsor asked for verified ETA.',
    status: 'IN_PROGRESS',
    owner: 'Customer Success',
    impact: 'Medium',
    createdAt: '2026-01-27T09:45:00Z',
    summary: 'Need a joint call with Solutions Architect and CS lead. Provide timeline and unblock data share.',
    draft: 'Hey Acme team - we are validating the automation patch and will deliver the ETA by 10am PT tomorrow.',
    metrics: {
      exposure: '$120K ARR',
      riskWindow: '24h',
      playbook: 'CS-12 Reassurance Loop',
    },
  },
  {
    id: 'act-9014',
    type: 'Churn-save promotion',
    customer: 'Globex Manufacturing',
    reason: 'Usage dipped 18% week-over-week; AI suggests proactive discount to lock renewal.',
    status: 'EXECUTED',
    owner: 'Growth Ops',
    impact: 'Low',
    createdAt: '2026-01-26T08:10:00Z',
    summary: 'Campaign launched with 3-month premium support add-on; monitoring uplift daily.',
    draft: 'Globex now has premium workflow monitoring enabled. Expect the new automation pack by Monday.',
    metrics: {
      exposure: '$80K ARR',
      riskWindow: '7d',
      playbook: 'Growth-02 Retention Offer',
    },
  },
]

export const LIVE_METRICS = [
  { label: 'Signals processed (24h)', value: '182', delta: '+18%' },
  { label: 'Actions awaiting approval', value: '4', delta: '+1 vs yesterday' },
  { label: 'Automation success rate', value: '94%', delta: '+3 pts' },
]

export const WATCHERS = [
  { label: 'Ops Desk', detail: 'Monitoring real-time risks' },
  { label: 'Finance Escalations', detail: 'Auto-approvals paused' },
  { label: 'AI Policy', detail: 'Audit scheduled 14:00 UTC' },
]
