import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CreateUserForm from '../components/admin/CreateUserForm';
import { createUserRequest } from '../api/admin.api';

jest.mock('../api/admin.api', () => ({
  createUserRequest: jest.fn(),
}));

const mockCreateUser = createUserRequest as jest.MockedFunction<typeof createUserRequest>;

const fillForm = async (overrides: Partial<Record<string, string>> = {}) => {
  const fields = {
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane@example.com',
    company: 'Acme',
    ...overrides,
  };
  if (fields.first_name) await userEvent.type(screen.getByLabelText(/first name/i), fields.first_name);
  if (fields.last_name) await userEvent.type(screen.getByLabelText(/last name/i), fields.last_name);
  if (fields.email) await userEvent.type(screen.getByLabelText(/email address/i), fields.email);
  if (fields.company) await userEvent.type(screen.getByLabelText(/company/i), fields.company);
};

beforeEach(() => {
  jest.clearAllMocks();
});

/* Rendering */
describe('rendering', () => {
  it('renders all form fields', () => {
    render(<CreateUserForm onBack={jest.fn()} />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/user role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('defaults role to learner', () => {
    render(<CreateUserForm onBack={jest.fn()} />);
    expect(screen.getByLabelText(/user role/i)).toHaveValue('learner');
  });
});

/* Validation */
describe('validation', () => {
  it('shows required errors when submitting empty form', async () => {
    render(<CreateUserForm onBack={jest.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /create user/i }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(1);
    });

    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Company is required')).toBeInTheDocument();
  });

  it('shows invalid email error', async () => {
    render(<CreateUserForm onBack={jest.fn()} />);

    await fillForm({ email: 'not-an-email' });
    await userEvent.click(screen.getByRole('button', { name: /create user/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('marks invalid fields with aria-invalid', async () => {
    render(<CreateUserForm onBack={jest.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /create user/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/first name/i)).toHaveAttribute('aria-invalid', 'true');
    });
  });
});

/* Successful submission */
describe('successful submission', () => {
  it('calls createUserRequest with correct payload', async () => {
    mockCreateUser.mockResolvedValueOnce(undefined as never);
    const onBack = jest.fn();
    render(<CreateUserForm onBack={onBack} />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: /create user/i }));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        company: 'Acme',
        role: 'learner',
      });
    });
  });

  it('calls onBack after successful submission', async () => {
    mockCreateUser.mockResolvedValueOnce(undefined as never);
    const onBack = jest.fn();
    render(<CreateUserForm onBack={onBack} />);

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: /create user/i }));

    await waitFor(() => {
      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  it('submits with admin role when selected', async () => {
    mockCreateUser.mockResolvedValueOnce(undefined as never);
    render(<CreateUserForm onBack={jest.fn()} />);

    await fillForm();
    await userEvent.selectOptions(screen.getByLabelText(/user role/i), 'admin');
    await userEvent.click(screen.getByRole('button', { name: /create user/i }));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'admin' })
      );
    });
  });
});

/* Cancel */
describe('cancel button', () => {
  it('calls onBack when Cancel is clicked', async () => {
    const onBack = jest.fn();
    render(<CreateUserForm onBack={onBack} />);

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(mockCreateUser).not.toHaveBeenCalled();
  });
});
