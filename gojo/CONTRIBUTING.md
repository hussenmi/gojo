# Contributing to Gojo

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Write descriptive commit messages

### Component Guidelines

1. **File Naming**: Use PascalCase for components (`PropertyCard.tsx`)
2. **Component Structure**:
   - Functional components with TypeScript
   - Props interface defined above component
   - Use named exports for components

3. **Example Component**:
```tsx
interface PropertyCardProps {
  title: string;
  price: number;
  location: string;
}

export function PropertyCard({ title, price, location }: PropertyCardProps) {
  return (
    <div className="property-card">
      {/* component content */}
    </div>
  );
}
```

### Directory Structure

```
components/
├── ui/              # Reusable UI components (buttons, inputs, cards)
├── layout/          # Layout components (header, footer, sidebar)
├── features/        # Feature-specific components (property-list, search-filters)
└── shared/          # Shared/common components
```

### Git Workflow

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

### Commit Message Format

```
type(scope): description

Examples:
feat(search): add property type filter
fix(listing): resolve image loading issue
docs(readme): update installation steps
```

### Database Changes

- All schema changes should be done via Supabase migrations
- Create migration files in `supabase/migrations/`
- Test migrations locally before deploying

### Localization

- All user-facing text should support Amharic and English
- Use i18n library for translations
- Store translations in `public/locales/`

## Questions?

Open an issue for any questions or clarifications needed.
