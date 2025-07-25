interface SidebarProps {
  onSelectUser: (user: string) => void;
}

const users = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Lee",
  "Diana Torres",
  "Edward King",
  "Fiona Blake",
  "George Martin",
  "Hannah Wu",
  "Ian Novak",
  "Julia Brown",
];

export default function Sidebar({ onSelectUser }: SidebarProps) {
  return (
    <aside className="w-60 h-full bg-purple-300 border-r border-black p-4 overflow-y-auto">
      <h2 className="m-4 text-xl font-bold mb-4 border-b pb-2">Users</h2>
      <ul className="space-y-2">
        {users.map((user, idx) => (
          <li
            key={idx}
            className="m-2 p-2 rounded hover:bg-purple-200 transition cursor-pointer text-sm font-medium"
            onClick={() => onSelectUser(user)}
          >
            {user}
          </li>
        ))}
      </ul>
    </aside>
  );
}
