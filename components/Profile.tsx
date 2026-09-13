import { SiteSettings } from '@prisma/client';

interface ProfileProps {
  settings: SiteSettings | null;
}

export default function Profile({ settings }: ProfileProps) {
  const name = settings?.name || 'Tevin Space';
  const bio = settings?.bio || 'Curated deals & gear I actually use • Affiliate links';
  const handle = settings?.bioHandle || '@tevinspace';
  const avatarUrl = settings?.avatarUrl;

  return (
    <section className="py-8 px-4 max-w-[480px] mx-auto">
      <div className="text-center">
        {/* Avatar */}
        {avatarUrl && (
          <div className="mb-4 flex justify-center">
            <img
              src={avatarUrl}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-4 border-tevin-product"
            />
          </div>
        )}

        {/* Name */}
        <h1 className="text-3xl font-black text-tevin-text mb-2">{name}</h1>

        {/* Handle */}
        <p className="text-sm text-tevin-text/60 mb-3">{handle}</p>

        {/* Bio */}
        <p className="text-base text-tevin-text/80 mb-6">{bio}</p>

        {/* CTA Button */}
        <button className="bubble-btn w-full sm:w-auto">
          🔥 Explore My Picks
        </button>
      </div>
    </section>
  );
}
