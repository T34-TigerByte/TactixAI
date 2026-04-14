import {
  authResponseSchema,
  userSchema,
  adminUserSchema,
  adminUserByIdSchema,
  learnerStatsSchema,
  learnerScenarioSchema,
  scenarioPageSchema,
  sessionDetailsSchema,
} from '../schemas/api.schema';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';

/* authResponseSchema */
describe('authResponseSchema', () => {
  it('passes with valid tokens', () => {
    const result = authResponseSchema.safeParse({
      access_token: 'abc',
      refresh_token: 'xyz',
    });
    expect(result.success).toBe(true);
  });

  it('fails when access_token is missing', () => {
    const result = authResponseSchema.safeParse({ refresh_token: 'xyz' });
    expect(result.success).toBe(false);
  });
});

/* userSchema */
describe('userSchema', () => {
  const base = {
    role: 'learner' as const,
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@example.com',
  };

  it('passes without optional fields', () => {
    expect(userSchema.safeParse(base).success).toBe(true);
  });

  it('passes with optional fields present', () => {
    const result = userSchema.safeParse({
      ...base,
      id: 1,
      company: 'Acme',
      created_at: '2024-01-01',
      updated_at: '2024-01-02',
    });
    expect(result.success).toBe(true);
  });

  it('fails with invalid role', () => {
    expect(userSchema.safeParse({ ...base, role: 'superuser' }).success).toBe(false);
  });

  it('fails with invalid email', () => {
    expect(userSchema.safeParse({ ...base, email: 'not-an-email' }).success).toBe(false);
  });
});

/* adminUserSchema */
describe('adminUserSchema', () => {
  const valid = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    joined_at: 1700000000,
    company: 'Acme',
    session: { completed: 5, last_session_at: null, total_time_spent: 120 },
  };

  it('passes with valid list item', () => {
    expect(adminUserSchema.safeParse(valid).success).toBe(true);
  });

  it('fails when id is missing', () => {
    const { id: _, ...rest } = valid;
    expect(adminUserSchema.safeParse(rest).success).toBe(false);
  });
});

/* adminUserByIdSchema — no id or name */
describe('adminUserByIdSchema', () => {
  const valid = {
    email: 'jane@example.com',
    joined_at: 1700000000,
    company: 'Acme',
    session: { completed: 5, last_session_at: null, total_time_spent: 120 },
  };

  it('passes without id and name', () => {
    expect(adminUserByIdSchema.safeParse(valid).success).toBe(true);
  });

  it('fails with invalid email', () => {
    expect(adminUserByIdSchema.safeParse({ ...valid, email: 'bad' }).success).toBe(false);
  });
});

/* learnerStatsSchema */
describe('learnerStatsSchema', () => {
  const valid = {
    session: { total: 10, average_score: 78, total_hours: 20 },
    progress: { communication: 80, negotication: 75, risk_management: 88 },
  };

  it('passes with valid stats', () => {
    expect(learnerStatsSchema.safeParse(valid).success).toBe(true);
  });

  it('passes with optional current_streak', () => {
    const result = learnerStatsSchema.safeParse({
      ...valid,
      session: { ...valid.session, current_streak: 5 },
    });
    expect(result.success).toBe(true);
  });

  it('fails when progress field is missing', () => {
    const { progress: _, ...rest } = valid;
    expect(learnerStatsSchema.safeParse(rest).success).toBe(false);
  });
});

/* createUserSchema */
describe('createUserSchema', () => {
  const valid = {
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@example.com',
    role: 'learner' as const,
    company: 'Acme',
  };

  it('passes with all required fields', () => {
    expect(createUserSchema.safeParse(valid).success).toBe(true);
  });

  it('fails when first_name is empty', () => {
    const result = createUserSchema.safeParse({ ...valid, first_name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('First name is required');
    }
  });

  it('fails with invalid email', () => {
    expect(createUserSchema.safeParse({ ...valid, email: 'bad' }).success).toBe(false);
  });

  it('fails with invalid role', () => {
    expect(createUserSchema.safeParse({ ...valid, role: 'guest' }).success).toBe(false);
  });
});

/* updateUserSchema */
describe('updateUserSchema', () => {
  it('passes with all fields optional (empty object)', () => {
    expect(updateUserSchema.safeParse({}).success).toBe(true);
  });

  it('passes with partial fields', () => {
    expect(updateUserSchema.safeParse({ first_name: 'Jane' }).success).toBe(true);
  });
});

/* learnerScenarioSchema */
describe('learnerScenarioSchema', () => {
  const valid = {
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Healthcare Data Breach',
    description: 'A ransomware attack on hospital records.',
    time_estimate: 40,
    threat_actor: 'RansomCrew',
  };

  it('passes with all required fields', () => {
    expect(learnerScenarioSchema.safeParse(valid).success).toBe(true);
  });

  it('fails when uuid is not a valid UUID', () => {
    expect(learnerScenarioSchema.safeParse({ ...valid, uuid: 'not-a-uuid' }).success).toBe(false);
  });

  it('fails when title is missing', () => {
    const { title: _, ...rest } = valid;
    expect(learnerScenarioSchema.safeParse(rest).success).toBe(false);
  });

  it('fails when time_estimate is not a number', () => {
    expect(learnerScenarioSchema.safeParse({ ...valid, time_estimate: '40' }).success).toBe(false);
  });
});

/* scenarioPageSchema */
describe('scenarioPageSchema', () => {
  const valid = {
    total: 10,
    pagination: {
      next_cursor: 'cursor-abc',
      prev_cursor: null,
      has_next: true,
      has_prev: false,
      limit: 5,
    },
    data: [
      {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Healthcare Data Breach',
        description: 'Ransomware on hospital records.',
        time_estimate: 40,
        threat_actor: 'RansomCrew',
      },
    ],
  };

  it('passes with valid page', () => {
    expect(scenarioPageSchema.safeParse(valid).success).toBe(true);
  });

  it('passes when next_cursor is null', () => {
    const result = scenarioPageSchema.safeParse({
      ...valid,
      pagination: { ...valid.pagination, next_cursor: null, has_next: false },
    });
    expect(result.success).toBe(true);
  });

  it('passes with empty data array', () => {
    expect(scenarioPageSchema.safeParse({ ...valid, data: [] }).success).toBe(true);
  });

  it('fails when pagination is missing', () => {
    const { pagination: _, ...rest } = valid;
    expect(scenarioPageSchema.safeParse(rest).success).toBe(false);
  });

  it('fails when has_next is not a boolean', () => {
    const result = scenarioPageSchema.safeParse({
      ...valid,
      pagination: { ...valid.pagination, has_next: 1 },
    });
    expect(result.success).toBe(false);
  });
});

/* sessionDetailsSchema */
describe('sessionDetailsSchema', () => {
  const valid = {
    time_estimate: 40,
    system_message: 'Welcome to the training.',
    questions: [
      {
        title: 'What is the threat actor motivation?',
        question_key: 'q1',
        options: [
          { title: 'Financial gain', answer_key: 'a1' },
          { title: 'Espionage', answer_key: 'a2' },
        ],
      },
    ],
  };

  it('passes with all fields present', () => {
    expect(sessionDetailsSchema.safeParse(valid).success).toBe(true);
  });

  it('passes without optional system_message', () => {
    const { system_message: _, ...rest } = valid;
    expect(sessionDetailsSchema.safeParse(rest).success).toBe(true);
  });

  it('passes with empty questions array', () => {
    expect(sessionDetailsSchema.safeParse({ ...valid, questions: [] }).success).toBe(true);
  });

  it('fails when questions is missing', () => {
    const { questions: _, ...rest } = valid;
    expect(sessionDetailsSchema.safeParse(rest).success).toBe(false);
  });

  it('fails when an option is missing answer_key', () => {
    const result = sessionDetailsSchema.safeParse({
      ...valid,
      questions: [
        {
          ...valid.questions[0],
          options: [{ title: 'Financial gain' }],
        },
      ],
    });
    expect(result.success).toBe(false);
  });
});
