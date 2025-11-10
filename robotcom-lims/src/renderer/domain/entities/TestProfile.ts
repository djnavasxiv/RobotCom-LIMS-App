import { Entity } from './Entity';
import { Test } from './Test';

interface TestProfileProps {
  name: string;
  description?: string;
  isActive: boolean;
  tests: Test[];
}

export class TestProfile extends Entity<TestProfileProps> {
  private constructor(props: TestProfileProps, id?: string) {
    super(props, id);
  }

  public static create(props: TestProfileProps, id?: string): TestProfile {
    const profile = new TestProfile(props, id);
    if (!profile.validate()) {
      throw new Error('Invalid test profile data');
    }
    return profile;
  }

  public validate(): boolean {
    return this.props.name?.trim().length > 0 &&
           this.props.tests?.length > 0;
  }

  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get isActive(): boolean { return this.props.isActive; }
  get tests(): Test[] { return this.props.tests; }

  public addTest(test: Test): void {
    this.props.tests.push(test);
    this.touch();
  }

  public removeTest(testId: string): void {
    this.props.tests = this.props.tests.filter(t => t.id !== testId);
    this.touch();
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  public activate(): void {
    this.props.isActive = true;
    this.touch();
  }
}
