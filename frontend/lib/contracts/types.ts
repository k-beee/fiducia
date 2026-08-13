export interface Fund {
  fund_id: string;
  funder: string;
  grantee: string;
  curator: string;
  title: string;
  milestones: string[];
  acceptance_criteria: string;
  disbursements: number[];
  total_amount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CLAWBACK_PENDING' | 'CLAWED_BACK' | 'CLOSED';
  current_milestone: number;
  dispatch_ids: string[];
  failed_streak: number;
  released_wei: number;
}

export interface Dispatch {
  dispatch_id: string;
  fund_id: string;
  grantee: string;
  milestone_index: number;
  milestone_text: string;
  narrative: string;
  evidence_urls: string[];
  ruling: DispatchRuling;
  overall: 'PASSED' | 'FAILED';
  disbursement_released_wei: number;
  challenged: boolean;
  challenge_outcome: 'OVERTURNED' | 'UPHELD' | null;
  challenge_ruling: DispatchRuling | null;
}

export interface DispatchRuling {
  execution_quality: 'EXCELLENT' | 'SATISFACTORY' | 'INSUFFICIENT';
  proof_strength: 'COMPELLING' | 'ADEQUATE' | 'MARGINAL' | 'ABSENT';
  budget_fidelity: 'ON_TRACK' | 'PARTIAL' | 'DIVERTED' | 'UNACCOUNTED';
  impact_veracity: 'DEMONSTRATED' | 'PLAUSIBLE' | 'UNSUBSTANTIATED';
  overall: 'PASSED' | 'FAILED';
  confidence: number;
  red_flags: string[];
  missing_information: string[];
  summary: string;
}

export interface ProtocolStats {
  fund_count: number;
  dispatch_count: number;
  live_fund_count: number;
  total_locked_wei: string;
  total_released_wei: string;
  total_reclaimed_wei: string;
}
