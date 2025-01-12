import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Phone, HelpCircle, AlertCircle, Heart } from 'lucide-react'

function ResourcesSection() {
  const resources = [
    {
      title: "Emergency Contacts",
      icon: Phone,
      items: [
        { label: "Emergency (Fire/Medical)", value: "911" },
        { label: "CAL FIRE General Contact", value: "1-916-653-5123" }
      ]
    },
    {
      title: "Evacuation Information",
      icon: AlertCircle,
      items: [
        { 
          label: "Evacuation Centers", 
          value: "Find nearest center",
          href: "https://news.caloes.ca.gov/shelters-available-for-communities-impacted-by-wildfires-in-southern-california-2/",
          target: "_blank"
        },
        { 
          label: "Emergency Alerts", 
          value: "Sign up for alerts",
          href: "https://www.listoscalifornia.org/alerts/",
          target: "_blank"
        }
      ]
    },
    {
      title: "Preparedness Resources",
      icon: HelpCircle,
      items: [
        { 
          label: "Emergency Kit Checklist", 
          value: "Download PDF",
          href: "https://www.ready.gov/sites/default/files/2021-02/ready_checklist.pdf",
          target: "_blank"
        },
        { 
          label: "Fire Safety Tips", 
          value: "Learn more",
          href: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/fire.html?srsltid=AfmBOooQ33TVqQoiPSYnCVdSZgPPd80HDS4yumaMTidFpOilpAYjFFex",
          target: "_blank"
        },
        { 
          label: "Air Quality Updates", 
          value: "Check status",
          href: "https://weather.com/forecast/air-quality/l/9720462459b9974380a654a8d3df130c9af4b30c3d7626196fcdb9eb99764aa9",
          target: "_blank"
        }
      ]
    },
    {
      title: "Medical Assistance",
      icon: Heart,
      items: [
        { 
          label: "Find Medical Centers", 
          value: "View map",
          href: "https://www.google.com/maps/search/medical+centers+in+Los+Angeles,+CA/@34.0701124,-118.5331882,10.19z?entry=ttu&g_ep=EgoyMDI1MDEwOC4wIKXMDSoASAFQAw%3D%3D",
          target: "_blank"
        },
        { 
          label: "Mental Health Support", 
          value: "Get help",
          href: "https://www.mentalhealth.ca.gov/",
          target: "_blank"
        },
        { 
          label: "Red Cross Services", 
          value: "Learn more",
          href: "https://www.redcross.org/local/california/southern-california/get-help.html",
          target: "_blank"
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="text-lg">Resources For Help</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center space-x-2">
                <resource.icon className="h-5 w-5" />
                <h3 className="font-semibold">{resource.title}</h3>
              </div>
              <div className="space-y-3">
                {resource.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex flex-col space-y-1">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    {item.href ? (
                      <a 
                        href={item.href}
                        target={item.target}
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="font-medium">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ResourcesSection