import { Entity } from './Entity';
import { Test } from './Test';
import { TestProfile } from './TestProfile';

interface SampleProps {
  sampleNumber: string;
  patientId: string;
  profile?: TestProfile;
  tests: Test[];
  collectionDate: Date;
  status: 'pending' | 'collected' | 'processing' | 'complete';
  notes?: string;
}

export class Sample extends Entity<SampleProps> {
  private constructor(props: SampleProps, id?: string) {
    super(props, id);
  }

  public static create(props: SampleProps, id?: string): Sample {
    const sample = new Sample(props, id);
    if (!sample.validate()) {
      throw new Error('Invalid sample data');
    }
    return sample;
  }

  public validate(): boolean {
    return this.props.sampleNumber?.trim().length > 0 &&
           this.props.patientId?.trim().length > 0 &&
           (this.props.tests?.length > 0 || !!this.props.profile);
  }

  get sampleNumber(): string { return this.props.sampleNumber; }
  get patientId(): string { return this.props.patientId; }
  get profile(): TestProfile | undefined { return this.props.profile; }
  get tests(): Test[] { return this.props.tests; }
  get collectionDate(): Date { return this.props.collectionDate; }
  get status(): string { return this.props.status; }
  get notes(): string | undefined { return this.props.notes; }

  public getTotalPrice(): number {
    if (this.props.profile) {
      // In a real app, profiles might have a discounted price.
      // For now, we'll just sum the test prices.
      return this.props.profile.tests.reduce((total, test) => total + test.price, 0);
    }
    return this.props.tests.reduce((total, test) => total + test.price, 0);
  }
}
