export const Header = ({
  title,
  description,
}: {
  title: string;
  description: string | string[];
}) => {
  const descriptionArray = Array.isArray(description)
    ? description
    : [description];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      {descriptionArray.map((desc) => (
        <p key={desc}>{desc}</p>
      ))}
    </div>
  );
};
