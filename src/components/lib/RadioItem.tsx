import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';

type Props = {
  id: string;
  value: string;
  label: string;
};

const RadioItem = ({ id, value, label }: Props) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
};

export default RadioItem;
