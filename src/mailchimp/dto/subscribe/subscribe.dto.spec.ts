import { validateSync } from 'class-validator';
import { SubscribeDto } from './subscribe.dto';

describe('SubscribeDto', () => {
  it('should validate with only required fields', () => {
    const dto = new SubscribeDto();
    dto.email = 'valid@example.com';

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate with all fields', () => {
    const dto = new SubscribeDto();
    dto.email = 'valid@example.com';
    dto.firstName = 'John';
    dto.lastName = 'Doe';
    dto.tags = ['customer', 'newsletter'];
    dto.language = 'en';

    const errors = validateSync(dto);
    expect(errors.length).toBe(0);
  });

  describe('email validation', () => {
    it('should fail if email is empty', () => {
      const dto = new SubscribeDto();
      dto.email = '';

      const errors = validateSync(dto);
      expect(errors.length).toBeGreaterThan(0);

      const emailError = errors.find((error) => error.property === 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints).toBeDefined();
      expect(emailError?.constraints?.isEmail).toBeDefined();
    });

    it('should fail if email is invalid', () => {
      const dto = new SubscribeDto();
      dto.email = 'not-an-email';

      const errors = validateSync(dto);

      expect(errors.length).toBeGreaterThan(0);

      const emailError = errors.find((error) => error.property === 'email');
      expect(emailError).toBeDefined();

      if (emailError?.constraints) {
        expect(emailError.constraints.isEmail).toBeDefined();
        expect(emailError.constraints.isEmail).toContain('email must be an email');
      } else {
        fail('Email error or constraints should be defined');
      }
    });
  });

  describe('optional fields', () => {
    it('should accept missing optional fields', () => {
      const dto = new SubscribeDto();
      dto.email = 'valid@example.com';

      const errors = validateSync(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if firstName is not a string', () => {
      const invalidData = {
        email: 'valid@example.com',
        firstName: 123,
      };

      const dto = new SubscribeDto();
      Object.assign(dto, invalidData);

      const errors = validateSync(dto);

      const firstNameError = errors.find((e) => e.property === 'firstName');

      expect(firstNameError).toBeDefined();
      expect(firstNameError?.constraints?.isString).toBeDefined();
      expect(firstNameError?.constraints?.isString).toMatch(/must be a string/i);
    });

    it('should fail if tags contains non-string values', () => {
      const invalidData = {
        email: 'valid@example.com',
        tags: ['valid', 123] as any[],
      };

      const dto = new SubscribeDto();
      Object.assign(dto, invalidData);

      const errors = validateSync(dto);

      const tagsError = errors.find((e) => e.property === 'tags');

      expect(tagsError).toBeDefined();

      if (tagsError?.constraints) {
        expect(tagsError.constraints.isString).toBeDefined();
        expect(tagsError.constraints.isString).toMatch(/each value in tags must be a string/i);
      } else {
        fail('Tags error or constraints should be defined');
      }
    });
  });

  describe('tags array', () => {
    it('should accept valid tags array', () => {
      const dto = new SubscribeDto();
      dto.email = 'valid@example.com';
      dto.tags = ['tag1', 'tag2'];

      const errors = validateSync(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept empty tags array', () => {
      const dto = new SubscribeDto();
      dto.email = 'valid@example.com';
      dto.tags = [];

      const errors = validateSync(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('language field', () => {
    it('should accept valid language string', () => {
      const dto = new SubscribeDto();
      dto.email = 'valid@example.com';
      dto.language = 'es';

      const errors = validateSync(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if language is not a string', () => {
      const invalidData: Omit<SubscribeDto, 'language'> & { language: number } = {
        email: 'valid@example.com',
        language: 123,
      };

      const dto = Object.assign(new SubscribeDto(), invalidData);

      const errors = validateSync(dto);

      const languageError = errors.find((e) => e.property === 'language');

      expect(languageError).toBeDefined();
      expect(languageError?.constraints?.isString).toBeDefined();
      expect(languageError?.constraints?.isString).toContain('language must be a string');
    });
  });
});
