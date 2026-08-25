import React from "react";
import { Helmet } from "react-helmet-async";
import PriorityTradelinesAU from "../../components/PriorityTradelines/PriorityTradelinesAU";

const PriorityTradelinesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Priority Tradelines AU | Money Solution Cafe</title>
        <meta 
          name="description" 
          content="Access authorized user priority tradelines to boost your credit profile, strengthen credit history, and increase funding approval odds with Money Solution Cafe." 
        />
        <link rel="canonical" href="https://moneysolutioncafe.com/priority-tradelines" />
        <meta property="og:title" content="Priority Tradelines AU | Money Solution Cafe" />
        <meta property="og:description" content="Access authorized user priority tradelines to boost your credit profile and increase funding approval odds." />
        <meta property="og:url" content="https://moneysolutioncafe.com/priority-tradelines" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://moneysolutioncafe.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Priority Tradelines",
                "item": "https://moneysolutioncafe.com/priority-tradelines"
              }
            ]
          })}
        </script>
      </Helmet>
      <PriorityTradelinesAU />
    </div>
  );
};

export default PriorityTradelinesPage;
