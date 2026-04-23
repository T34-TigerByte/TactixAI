import type { SessionDetails } from '../schemas/api.schema';

type MockQuestion = SessionDetails['questions'][number];

const MOCK_QUESTIONS: Record<string, MockQuestion[]> = {
  'University Research: Unauthorized Audit': [
    {
      title: 'How did the breach happen?',
      question_key: 'q1',
      options: [
        { answer_key: 'A', title: 'A. Stolen VPN credentials from a PhD researcher.' },
        { answer_key: 'B', title: 'B. SQL Injection on the student portal.' },
        { answer_key: 'C', title: 'C. Physical theft of a lab laptop.' },
        { answer_key: 'D', title: 'D. Open Wi-Fi at the campus cafe.' },
      ],
    },
    {
      title: 'Which systems are affected?',
      question_key: 'q2',
      options: [
        { answer_key: 'A', title: 'A. The Research VLAN and local backup server.' },
        { answer_key: 'B', title: 'B. The University library catalog.' },
        { answer_key: 'C', title: 'C. The payroll department\'s cloud storage.' },
        { answer_key: 'D', title: 'D. The student email exchange server.' },
      ],
    },
    {
      title: 'What data is at risk?',
      question_key: 'q3',
      options: [
        { answer_key: 'A', title: 'A. 5 years of Cancer Research and Clinical Trial data.' },
        { answer_key: 'B', title: 'B. Undergraduate student grades.' },
        { answer_key: 'C', title: 'C. Campus facility maintenance schedules.' },
        { answer_key: 'D', title: 'D. Faculty cafeteria transaction history.' },
      ],
    },
  ],
  'Mining Ops: SCADA System Restriction': [
    {
      title: 'How did the breach happen?',
      question_key: 'q1',
      options: [
        { answer_key: 'A', title: 'A. Exploited vulnerability in Remote Desktop (RDP).' },
        { answer_key: 'B', title: 'B. Brute-forcing the admin password.' },
        { answer_key: 'C', title: 'C. Social engineering a truck driver.' },
        { answer_key: 'D', title: 'D. A malicious USB found in the parking lot.' },
      ],
    },
    {
      title: 'Which systems are affected?',
      question_key: 'q2',
      options: [
        { answer_key: 'A', title: 'A. SCADA Control Network and Logistics Database.' },
        { answer_key: 'B', title: 'B. The onsite CCTV security system.' },
        { answer_key: 'C', title: 'C. Public-facing corporate website.' },
        { answer_key: 'D', title: 'D. The geological survey drone fleet.' },
      ],
    },
    {
      title: 'What data is at risk?',
      question_key: 'q3',
      options: [
        { answer_key: 'A', title: 'A. Fleet Management and Machine Maintenance Logs.' },
        { answer_key: 'B', title: 'B. Employee uniform sizes and HR records.' },
        { answer_key: 'C', title: 'C. Geological maps of future dig sites.' },
        { answer_key: 'D', title: 'D. Quarterly environmental impact reports.' },
      ],
    },
  ],
  'Healthcare: Patient Data Settlement': [
    {
      title: 'How did the breach happen?',
      question_key: 'q1',
      options: [
        { answer_key: 'A', title: 'A. Phishing email: "COVID-26 Policy Update."' },
        { answer_key: 'B', title: 'B. Guessing the default password on an MRI.' },
        { answer_key: 'C', title: 'C. Outdated WordPress plugin on the blog.' },
        { answer_key: 'D', title: 'D. Man-in-the-middle attack on Guest Wi-Fi.' },
      ],
    },
    {
      title: 'Which systems are affected?',
      question_key: 'q2',
      options: [
        { answer_key: 'A', title: 'A. Active Directory and the Patient Portal.' },
        { answer_key: 'B', title: 'B. The digital signage in the waiting rooms.' },
        { answer_key: 'C', title: 'C. The pharmacy\'s inventory and prescription records.' },
        { answer_key: 'D', title: 'D. The cafeteria\'s Point-of-Sale (POS) system.' },
      ],
    },
    {
      title: 'What data is at risk?',
      question_key: 'q3',
      options: [
        { answer_key: 'A', title: 'A. 50,000+ Electronic Health Records (EHR).' },
        { answer_key: 'B', title: 'B. Staff shift rosters for the next month.' },
        { answer_key: 'C', title: 'C. Public pharmaceutical research papers.' },
        { answer_key: 'D', title: 'D. The CEO\'s internal email archive.' },
      ],
    },
  ],
  'Regional Bank: Gateway Integrity Review': [
    {
      title: 'How did the breach happen?',
      question_key: 'q1',
      options: [
        { answer_key: 'A', title: 'A. Malicious macro in a Financial Audit email.' },
        { answer_key: 'B', title: 'B. A DDoS attack that crashed the firewall.' },
        { answer_key: 'C', title: 'C. SIM swapping the Branch Manager\'s phone.' },
        { answer_key: 'D', title: 'D. Scraping data from social media.' },
      ],
    },
    {
      title: 'Which systems are affected?',
      question_key: 'q2',
      options: [
        { answer_key: 'A', title: 'A. The SWIFT Gateway and administrator workstations.' },
        { answer_key: 'B', title: 'B. The bank\'s mobile app marketing server.' },
        { answer_key: 'C', title: 'C. The internal "Employee of the Month" portal.' },
        { answer_key: 'D', title: 'D. The physical ATM network in the lobby.' },
      ],
    },
    {
      title: 'What data is at risk?',
      question_key: 'q3',
      options: [
        { answer_key: 'A', title: 'A. Wire Transfer Logs and Transaction History.' },
        { answer_key: 'B', title: 'B. Archived marketing brochures from 2018.' },
        { answer_key: 'C', title: 'C. General ledger of branch office supplies.' },
        { answer_key: 'D', title: 'D. Corporate sponsorship contracts.' },
      ],
    },
  ],
  'University Research: VIP Record Leak': [
    {
      title: 'How did the breach happen?',
      question_key: 'q1',
      options: [
        { answer_key: 'A', title: 'A. Misconfigured Public S3 Cloud Bucket.' },
        { answer_key: 'B', title: 'B. Phishing the Dean of Science.' },
        { answer_key: 'C', title: 'C. Exploiting a vulnerability in the campus VPN.' },
        { answer_key: 'D', title: 'D. Tailgating a researcher into the server room.' },
      ],
    },
    {
      title: 'Which systems are affected?',
      question_key: 'q2',
      options: [
        { answer_key: 'A', title: 'A. Web Server and Departmental File Share.' },
        { answer_key: 'B', title: 'B. The library\'s digital book repository.' },
        { answer_key: 'C', title: 'C. The campus-wide Wi-Fi controller.' },
        { answer_key: 'D', title: 'D. The student sports facility booking system.' },
      ],
    },
    {
      title: 'What data is at risk?',
      question_key: 'q3',
      options: [
        { answer_key: 'A', title: 'A. Intellectual Property (IP) and Donor Lists.' },
        { answer_key: 'B', title: 'B. Current semester exam papers.' },
        { answer_key: 'C', title: 'C. Student parking permit records.' },
        { answer_key: 'D', title: 'D. The University\'s public annual report.' },
      ],
    },
  ],
  'Mining Ops: Operational Countdown': [
    {
      title: 'How did the breach happen?',
      question_key: 'q1',
      options: [
        { answer_key: 'A', title: 'A. Compromised vendor with "Always-On" VPN.' },
        { answer_key: 'B', title: 'B. A "Zero-Day" exploit in Microsoft Outlook.' },
        { answer_key: 'C', title: 'C. Brute-force attack on admin\'s LinkedIn pass.' },
        { answer_key: 'D', title: 'D. Buying access from an Initial Access Broker.' },
      ],
    },
    {
      title: 'Which systems are affected?',
      question_key: 'q2',
      options: [
        { answer_key: 'A', title: 'A. Smelting Control Center and ERP System.' },
        { answer_key: 'B', title: 'B. The GPS tracking on the excavators.' },
        { answer_key: 'C', title: 'C. The mine site\'s internal radio frequency.' },
        { answer_key: 'D', title: 'D. The visitor check-in kiosk at the main gate.' },
      ],
    },
    {
      title: 'What data is at risk?',
      question_key: 'q3',
      options: [
        { answer_key: 'A', title: 'A. Operational Control Logic (PLC) and Payroll.' },
        { answer_key: 'B', title: 'B. Menu for the on-site mining camp mess hall.' },
        { answer_key: 'C', title: 'C. Historical weather data for the mine location.' },
        { answer_key: 'D', title: 'D. Generic safety training videos.' },
      ],
    },
  ],
  'Healthcare: Patient History Exposure': [
    {
      title: 'How did the breach happen?',
      question_key: 'q1',
      options: [
        { answer_key: 'A', title: 'A. Unpatched VPN Gateway (CVE-2023-XXXX).' },
        { answer_key: 'B', title: 'B. A nurse left a workstation unlocked.' },
        { answer_key: 'C', title: 'C. Stolen physical keycard to the server room.' },
        { answer_key: 'D', title: 'D. Spoofing the hospital\'s VOIP phone system.' },
      ],
    },
    {
      title: 'Which systems are affected?',
      question_key: 'q2',
      options: [
        { answer_key: 'A', title: 'A. Diagnostic Imaging Server (PACS).' },
        { answer_key: 'B', title: 'B. The automated medication dispensers.' },
        { answer_key: 'C', title: 'C. The hospital\'s public Facebook page.' },
        { answer_key: 'D', title: 'D. The appointment scheduling software.' },
      ],
    },
    {
      title: 'What data is at risk?',
      question_key: 'q3',
      options: [
        { answer_key: 'A', title: 'A. High-Res MRI Scans and Staff Comms.' },
        { answer_key: 'B', title: 'B. Hospital laundry and linen service contracts.' },
        { answer_key: 'C', title: 'C. Public health brochures.' },
        { answer_key: 'D', title: 'D. Maintenance logs for backup generators.' },
      ],
    },
  ],
  'Regional Bank: SWIFT Network Sabotage': [
    {
      title: 'How did the breach happen?',
      question_key: 'q1',
      options: [
        { answer_key: 'A', title: 'A. Insider Threat (Disgruntled IT Admin).' },
        { answer_key: 'B', title: 'B. Exploiting a bug in the bank\'s ATM firmware.' },
        { answer_key: 'C', title: 'C. A spear-phishing campaign against tellers.' },
        { answer_key: 'D', title: 'D. Scraping credentials from a previous breach.' },
      ],
    },
    {
      title: 'Which systems are affected?',
      question_key: 'q2',
      options: [
        { answer_key: 'A', title: 'A. Core Banking Database and Backup Tapes.' },
        { answer_key: 'B', title: 'B. The telephone banking automated system.' },
        { answer_key: 'C', title: 'C. The office printers and photocopiers.' },
        { answer_key: 'D', title: 'D. The security cameras in the parking lot.' },
      ],
    },
    {
      title: 'What data is at risk?',
      question_key: 'q3',
      options: [
        { answer_key: 'A', title: 'A. Decryption Keys for Customer Vaults.' },
        { answer_key: 'B', title: 'B. Scanned copies of employee driving licenses.' },
        { answer_key: 'C', title: 'C. Internal meeting minutes about renovations.' },
        { answer_key: 'D', title: 'D. The bank\'s generic mortgage calculator.' },
      ],
    },
  ],
};

export function getMockQuestions(scenarioTitle: string): MockQuestion[] {
  return MOCK_QUESTIONS[scenarioTitle] ?? [];
}
