type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <div className="flex flex-col items-center gap-[0.6rem] rounded-[10px] bg-gray-700 p-4">
      <h3 className="text-[1.2rem]">{title}</h3>
      <hr className="w-full border border-solid border-purple-700" />
      {children}
    </div>
  );
}

export default Section;
