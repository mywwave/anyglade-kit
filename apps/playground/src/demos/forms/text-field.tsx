import { Input, Label, TextField } from "@anyglade/kit";

export function TextFieldDemo() {
  return (
    <TextField className="w-full max-w-64" name="email" type="email">
      <Label>Email</Label>
      <Input placeholder="Enter your email" />
    </TextField>
  );
}
