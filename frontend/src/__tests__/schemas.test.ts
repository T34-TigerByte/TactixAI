import {
  authResponseSchema,
  userSchema,
  adminUserSchema,
  adminUserByIdSchema,
  learnerStatsSchema,
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
    session: { total: 10, total_hours: 20 },
    progress: { communication: 80, negotiation: 75, risk_management: 88 },
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
