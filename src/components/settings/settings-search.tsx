import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchSection {
  id: string;
  title: string;
  items: string[];
}

const SEARCH_INDEX: SearchSection[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      'Profile Picture',
      'First Name',
      'Last Name',
      'Username',
      'Email',
      'Phone',
      'About',
      'Theme',
      'Account Privacy',
    ],
  },
  {
    id: 'security',
    title: 'Security',
    items: [
      'Two-Factor Authentication',
      'Change Password',
      'Account Status',
      'Delete Account',
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    items: [
      'Enable Notifications',
      'Email Notifications',
      'Push Notifications',
      'SMS Notifications',
      'Promotional Emails',
      'Notification Sound',
      'Weekly Digest',
    ],
  },
  {
    id: 'billing',
    title: 'Billing',
    items: ['Current Plan', 'Change Plan', 'Payment Method', 'Billing History'],
  },
];

interface SettingsSearchProps {
  searchText: string;
  setSearch: (text: string) => void;
  onNavigate: (sectionId: string) => void;
}

export function SettingsSearch({
  searchText,
  setSearch,
  onNavigate,
}: SettingsSearchProps) {
  const query = searchText.trim().toLowerCase();

  const filteredSections = SEARCH_INDEX.filter(
    (section) =>
      section.title.toLowerCase().includes(query) ||
      section.items.some((item) => item.toLowerCase().includes(query))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-lg">
      <div className="flex max-h-96 w-full max-w-lg flex-col overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="relative">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={searchText} readOnly className="pl-8" />
        </div>

        <h2 className="mt-6 mb-6 text-center text-xl font-bold">Search Results</h2>

        {filteredSections.length > 0 ? (
          <ul className="space-y-6">
            {filteredSections.map((section) => (
              <li key={section.id}>
                <p className="mb-2 text-lg font-semibold">{section.title}</p>
                <ul className="space-y-2 pl-4">
                  {section.items.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => {
                          setSearch('');
                          onNavigate(section.id);
                        }}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">No results found</p>
        )}
      </div>
    </div>
  );
}
