import bcrypt from 'bcrypt';

async function hashText(text: string): Promise<string> {
  const saltRounds = 10;

  const hash = bcrypt.hashSync(text, saltRounds);
  return hash;
}

export {
  hashText
}
