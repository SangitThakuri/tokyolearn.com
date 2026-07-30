interface StructuredDataProps {
  type: "LearningResource" | "Article";
  name: string;
  description: string;
  url?: string;
  educationalLevel?: string;
  teaches?: string;
}

export function LearningResourceJsonLd({ name, description, educationalLevel, teaches }: StructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description,
    educationalLevel: educationalLevel || "Beginner",
    teaches: teaches || "Japanese",
    learningResourceType: "Grammar lesson",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function CourseJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "TokyoLearn - Japanese Language Course",
    description: "Complete Japanese language learning from absolute beginner to native-level proficiency. Covers JLPT N5 through N1.",
    provider: {
      "@type": "Organization",
      name: "TokyoLearn",
    },
    educationalCredentialAwarded: "JLPT N5 - N1",
    teaches: [
      "Japanese grammar",
      "Japanese vocabulary",
      "Kanji characters",
      "Japanese reading comprehension",
      "Japanese listening skills",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function VocabJsonLd({ name, description }: StructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description,
    learningResourceType: "Vocabulary word",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function KanjiJsonLd({ name, description }: StructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description,
    learningResourceType: "Kanji character",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
