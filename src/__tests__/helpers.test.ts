import { calculateDays, formatDate, validateEmail, validatePassword } from '@/lib/utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const result = formatDate('2024-06-15');
      expect(result).toContain('Jun');
      expect(result).toContain('15');
    });
  });

  describe('calculateDays', () => {
    it('should calculate number of days correctly', () => {
      const result = calculateDays('2024-06-15', '2024-06-20');
      expect(result).toBe(6); // 6 days including both start and end
    });

    it('should return 1 for same day', () => {
      const result = calculateDays('2024-06-15', '2024-06-15');
      expect(result).toBe(1);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate passwords with 8+ characters', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('12345678')).toBe(true);
    });

    it('should reject passwords with less than 8 characters', () => {
      expect(validatePassword('pass123')).toBe(false);
      expect(validatePassword('short')).toBe(false);
    });
  });
});
