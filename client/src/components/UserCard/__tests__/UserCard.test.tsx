import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserCard from '../index';

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Next.js Image component
vi.mock('next/image', () => {
  return {
    default: ({ src, alt, ...props }: any) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} {...props} />
    ),
  };
});

describe('UserCard', () => {
  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'ENGINEER',
    profilePictureUrl: '/profile.jpg',
  } as any;

  it('should render user information', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  it('should navigate to user detail page when clicked', async () => {
    const user = userEvent.setup();
    mockPush.mockClear();

    render(<UserCard user={mockUser} />);

    const card = screen.getByText('John Doe').closest('div');
    if (card) {
      await user.click(card);
      expect(mockPush).toHaveBeenCalledWith('/users/user-123');
    }
  });

  it('should render profile picture when available', () => {
    render(<UserCard user={mockUser} />);

    const image = screen.getByAltText('profile picture');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('profile.jpg'));
  });

  it('should handle missing profile picture gracefully', () => {
    const userWithoutPicture = { ...mockUser, profilePictureUrl: null };
    render(<UserCard user={userWithoutPicture} />);

    // When there's no profile picture, it should render initials instead of an image
    expect(screen.queryByAltText('profile picture')).not.toBeInTheDocument();
    // The component should display initials (JD for "John Doe")
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
});
