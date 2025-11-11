import { Entity } from './Entity';

interface ResultProps {
  sampleId: string;
  testId: string;
  value: string;
  isNormal: boolean;
  notes?: string;
  enteredBy?: string;
  enteredAt: Date;
}

export class Result extends Entity<ResultProps> {
  private constructor(props: ResultProps, id?: string) {
    super(props, id);
  }

  public static create(props: ResultProps, id?: string): Result {
    const result = new Result(props, id);
    if (!result.validate()) {
      throw new Error('Invalid result data');
    }
    return result;
  }

  public validate(): boolean {
    return this.props.sampleId?.trim().length > 0 &&
           this.props.testId?.trim().length > 0 &&
           this.props.value?.trim().length > 0;
  }

  get sampleId(): string { return this.props.sampleId; }
  get testId(): string { return this.props.testId; }
  get value(): string { return this.props.value; }
  get isNormal(): boolean { return this.props.isNormal; }
  get notes(): string | undefined { return this.props.notes; }
  get enteredBy(): string | undefined { return this.props.enteredBy; }
  get enteredAt(): Date { return this.props.enteredAt; }
}
