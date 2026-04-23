import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditUserForm from '../components/admin/EditUserForm';
import { updateUserRequest } from '../api/admin.api';
import type { AdminUserListItem } from '../schemas/api.schema';

jest.mock('../api/admin.api', () => ({
  updateUserRequest: jest.fn(),
}));

const mockUpdateUser = updateUserRequest as jest.MockedFunction<typeof updateUserRequest>;

const MOCK_USER: AdminUserListItem = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com',
  joined_at: 1700000000,
  company: 'Acme',
  session: { completed: 3, last_session_at: null, total_time_spent: 90 },
};

beforeEach(() => {
  jest.clearAllMocks();
});

/* Rendering */
describe('rendering', () => {
  it('renders editable and read-only fields', () => {
    render(<EditUserForm user={MOCK_USER} onBack={jest.fn()} />);

    // Editable inputs have associated labels via htmlFor
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();

    // Read-only fields are displayed as text (no associated input)
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('pre-fills first and last name from user.name', () => {
    render(<EditUserForm user={MOCK_USER} onBack={jest.fn()} />);

    expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
  });

  it('shows user role as read-only Learner', () => {
    render(<EditUserForm user={MOCK_USER} onBack={jest.fn()} />);
    expect(screen.getByText('Learner')).toBeInTheDocument();
  });
});

/* Successful submission */
describe('successful submission', () => {
  it('calls updateUserRequest with user id and changed name', async () => {
    mockUpdateUser.mockResolvedValueOnce(undefined as never);
    const onBack = jest.fn();
    render(<EditUserForm user={MOCK_USER} onBack={onBack} />);

    const firstInput = screen.getByLabelText(/first name/i);
    await userEvent.clear(firstInput);
    await userEvent.type(firstInput, 'Janet');

    await userEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(1, {
        first_name: 'Janet',
        last_name: 'Doe',
      });
    });
  });

  it('calls onBack after successful submission', async () => {
    mockUpdateUser.mockResolvedValueOnce(undefined as never);
    const onBack = jest.fn();
    render(<EditUserForm user={MOCK_USER} onBack={onBack} />);

    await userEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  it('submits with unchanged defaults when form is not modified', async () => {
    mockUpdateUser.mockResolvedValueOnce(undefined as never);
    render(<EditUserForm user={MOCK_USER} onBack={jest.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(1, {
        first_name: 'Jane',
        last_name: 'Doe',
      });
    });
  });
});

/* aria-invalid */
describe('accessibility', () => {
  it('does not mark fields as invalid on initial render', () => {
    render(<EditUserForm user={MOCK_USER} onBack={jest.fn()} />);

    expect(screen.getByLabelText(/first name/i)).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByLabelText(/last name/i)).toHaveAttribute('aria-invalid', 'false');
  });
});
