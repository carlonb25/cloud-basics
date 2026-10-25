export const QUIZ_VERSION = 3;

export const STACK = {
  layers: ["Applications", "Data", "Runtime", "Middleware", "Operating system", "Virtualization", "Servers", "Storage", "Networking"],
  youManage: { IaaS: 5, PaaS: 2, SaaS: 0 },
  notes: {
    IaaS: "You rent infrastructure such as virtual machines, storage, and networking. You manage the operating system and everything above it.",
    PaaS: "The provider manages the infrastructure, operating system, and runtime. You manage your application and its data.",
    SaaS: "The provider operates the application and the underlying stack. You manage your account, settings, and the content you put into the service."
  }
};

export const CLOUD_LANDSCAPE = [
  {
    id: "infrastructure", title: "Cloud infrastructure platforms",
    description: "These providers offer computing, storage, networking, databases, and other cloud services. Their platforms include infrastructure services as well as managed tools at higher layers.",
    companies: [
      { name: "Amazon Web Services (AWS)", example: "Amazon EC2 virtual servers", url: "https://aws.amazon.com/ec2/" },
      { name: "Microsoft Azure", example: "Azure Virtual Machines", url: "https://azure.microsoft.com/en-us/products/virtual-machines/" },
      { name: "Google Cloud", example: "Compute Engine virtual machines", url: "https://cloud.google.com/products/compute" },
      { name: "Oracle Cloud Infrastructure (OCI)", example: "OCI Compute", url: "https://www.oracle.com/cloud/compute/" },
      { name: "IBM Cloud", example: "IBM Cloud Virtual Servers", url: "https://www.ibm.com/cloud/virtual-servers" }
    ]
  },
  {
    id: "platform", title: "Managed application platforms (PaaS examples)",
    description: "These products let teams deploy or build applications while the provider manages more of the platform than in a typical virtual-machine setup.",
    companies: [
      { name: "AWS", example: "Elastic Beanstalk", url: "https://aws.amazon.com/elasticbeanstalk/" },
      { name: "Microsoft Azure", example: "Azure App Service", url: "https://azure.microsoft.com/en-us/products/app-service/" },
      { name: "Google Cloud", example: "App Engine", url: "https://cloud.google.com/appengine" },
      { name: "Red Hat", example: "OpenShift", url: "https://www.redhat.com/en/technologies/cloud-computing/openshift" }
    ]
  },
  {
    id: "software", title: "Cloud software (SaaS examples)",
    description: "These are finished applications people use over the internet. Their vendors operate the application, while customers manage users, settings, and their data.",
    companies: [
      { name: "Microsoft", example: "Microsoft 365", url: "https://www.microsoft.com/microsoft-365" },
      { name: "Google", example: "Google Workspace", url: "https://workspace.google.com/" },
      { name: "Salesforce", example: "Salesforce CRM", url: "https://www.salesforce.com/" }
    ]
  }
];

export const COURSE_SOURCES = [
  {
    id: "nist",
    title: "NIST SP 800-145: The NIST Definition of Cloud Computing",
    organization: "U.S. National Institute of Standards and Technology",
    url: "https://csrc.nist.gov/pubs/sp/800/145/final",
    use: "Primary reference for the cloud definition, essential characteristics, service models, and deployment models."
  },
  {
    id: "aws-models",
    title: "Cloud computing models",
    organization: "Amazon Web Services",
    url: "https://aws.amazon.com/types-of-cloud-computing/",
    use: "A provider's explanation of service and deployment models; used as a secondary cross-check."
  },
  {
    id: "shared-responsibility",
    title: "Shared responsibility in the cloud",
    organization: "Microsoft Learn",
    url: "https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility",
    use: "Reference for how provider and customer security responsibilities vary by service model."
  },
  {
    id: "google-cloud",
    title: "What is cloud computing?",
    organization: "Google Cloud",
    url: "https://cloud.google.com/learn/what-is-cloud-computing",
    use: "Supplementary provider explanation of cloud computing and deployment models."
  }
];

export const QUESTION_METHOD = "Questions in this course are original introductory practice items written to check whether learners can recognize and apply core cloud concepts. The pre-test and post-test use different examples aligned to the same topics. Definitions are grounded primarily in NIST SP 800-145 and cross-checked with the linked provider documentation; distractors are designed to represent common confusions, such as mixing service models with deployment models. This is educational material, not a certification exam.";

const PRETEST_QUIZ = [
  {
    concept: "cloud-basics", conceptLabel: "Cloud fundamentals",
    q: "A team can get computing resources when needed, use them over a network, and pay based on use instead of buying servers first. What are they using?",
    options: ["Cloud computing", "A private data center", "A desktop operating system", "A local backup drive"], answer: 0,
    miss: "A private data center describes where equipment may be located; a desktop operating system and a backup drive are not on-demand computing services.",
    why: "Cloud computing provides on-demand access to computing resources over a network. Capacity can be adjusted, and use is commonly metered."
  },
  {
    concept: "iaas", conceptLabel: "Infrastructure as a Service (IaaS)",
    q: "A developer rents a virtual machine and installs its operating system and web server. Which service model gives the developer this infrastructure-level control?",
    options: ["Software as a Service (SaaS)", "Platform as a Service (PaaS)", "Infrastructure as a Service (IaaS)", "Hybrid cloud"], answer: 2,
    miss: "The key clue is that the customer installs and maintains the operating system. That is more control than a managed application platform or finished software provides.",
    why: "Infrastructure as a Service (IaaS) provides virtualized computing resources. The customer configures and maintains the operating system and software installed on the virtual machine."
  },
  {
    concept: "paas", conceptLabel: "Platform as a Service (PaaS)",
    q: "A team wants to deploy its own application without managing operating-system patches or servers. Which service model best fits?",
    options: ["Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Software as a Service (SaaS)", "Private cloud"], answer: 1,
    miss: "The team is building and deploying its own application, so finished software (SaaS) is not the fit. It also does not need the operating-system control of IaaS.",
    why: "Platform as a Service (PaaS) provides a managed application platform. The provider operates the platform and infrastructure; the customer remains responsible for its application and data."
  },
  {
    concept: "saas", conceptLabel: "Software as a Service (SaaS)",
    q: "A school uses browser-based email and calendars maintained by a vendor. Staff manage messages and settings, not the software or servers. Which model is this?",
    options: ["Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Software as a Service (SaaS)", "Public cloud"], answer: 2,
    miss: "The school is using a complete application, not renting virtual-machine infrastructure or deploying its own code to a platform.",
    why: "Software as a Service (SaaS) is a ready-to-use application operated by its provider. Customers still manage their users, settings, and the data they enter."
  },
  {
    concept: "public", conceptLabel: "Public cloud",
    q: "A company starts a service using capacity from a cloud provider's shared infrastructure. The hardware is not dedicated to that company. Which deployment model is this?",
    options: ["Private cloud", "Public cloud", "Hybrid cloud", "On-premises only"], answer: 1,
    miss: "A private cloud is dedicated to one organization; hybrid cloud combines private and public environments. Shared provider infrastructure points to public cloud.",
    why: "In public cloud, a provider offers services to multiple customers on shared underlying infrastructure, with logical separation between customers."
  },
  {
    concept: "private", conceptLabel: "Private cloud",
    q: "An organization uses a cloud environment dedicated to that organization, whether it is hosted in its own building or by a third party. Which model is this?",
    options: ["Public cloud", "Private cloud", "Multi-cloud", "Software as a Service (SaaS)"], answer: 1,
    miss: "The defining clue is that the environment is dedicated to one organization. Its physical location does not change that definition.",
    why: "A private cloud is dedicated to one organization. It can be on-premises or hosted; location alone does not determine whether it is private."
  },
  {
    concept: "hybrid", conceptLabel: "Hybrid cloud",
    q: "A business keeps one workload in its private cloud and connects it to public-cloud services for extra capacity. Which model describes this arrangement?",
    options: ["Public cloud", "Private cloud", "Hybrid cloud", "Software as a Service (SaaS)"], answer: 2,
    miss: "Neither public nor private alone describes a connected combination of both environments. SaaS is a service model, not a deployment model.",
    why: "Hybrid cloud combines private and public cloud environments that are connected to support workloads or data across them."
  },
  {
    concept: "shared-responsibility", conceptLabel: "Shared responsibility",
    q: "Which statement about cloud security responsibility is most accurate?",
    options: [
      "The provider is responsible for every security task in every cloud service.",
      "The customer is responsible for every layer, including provider-owned hardware.",
      "Responsibilities are shared, and the customer's tasks depend partly on the service model.",
      "Using a public cloud removes the need to manage access to accounts and data."
    ], answer: 2,
    miss: "Cloud providers and customers have different security duties. Customers do not manage the provider's physical hardware, but they still manage identities, access, and data.",
    why: "The provider secures the cloud infrastructure, while customers retain responsibilities such as identities, access, and data. The exact division changes between IaaS, PaaS, and SaaS."
  }
];

const POSTTEST_QUIZ = [
  {
    concept: "cloud-basics", conceptLabel: "Cloud fundamentals",
    q: "A small business can add storage in minutes and pay for the capacity it uses rather than purchasing a storage system up front. Which idea does this illustrate?",
    options: ["Cloud computing", "Private cloud ownership", "A fixed-capacity server room", "Software licensing only"], answer: 0,
    miss: "The example is about requesting adjustable computing resources from a provider, not only software licensing or fixed, owned capacity.",
    why: "On-demand access and the ability to adjust capacity are foundational cloud characteristics. Many cloud services also meter usage."
  },
  {
    concept: "iaas", conceptLabel: "Infrastructure as a Service (IaaS)",
    q: "A research group needs control of its virtual machine's operating system and installed tools, while renting the compute and network underneath. Which model should it consider?",
    options: ["Software as a Service (SaaS)", "Platform as a Service (PaaS)", "Infrastructure as a Service (IaaS)", "Hybrid cloud"], answer: 2,
    miss: "The customer needs to configure the operating system. A managed platform or finished application would provide less operating-system control.",
    why: "Infrastructure as a Service (IaaS) offers virtualized compute, storage, and networking while leaving the customer in control of the guest operating system and installed software."
  },
  {
    concept: "paas", conceptLabel: "Platform as a Service (PaaS)",
    q: "A developer pushes application code to a managed environment; the provider maintains its runtime and operating system. Which model is being used?",
    options: ["Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Software as a Service (SaaS)", "Private cloud"], answer: 1,
    miss: "The developer supplies application code, so this is not a ready-to-use SaaS application. The provider also manages the operating system, unlike the customer's usual role in IaaS.",
    why: "Platform as a Service (PaaS) lets a customer focus on application code and data while the provider operates the application platform and underlying infrastructure."
  },
  {
    concept: "saas", conceptLabel: "Software as a Service (SaaS)",
    q: "A nonprofit subscribes to an online fundraising application and configures its users and campaign information. The vendor runs and updates the application. Which model is this?",
    options: ["Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Software as a Service (SaaS)", "Hybrid cloud"], answer: 2,
    miss: "The nonprofit subscribes to a complete application; it is not deploying its own code or configuring virtual-machine infrastructure.",
    why: "Software as a Service (SaaS) provides a complete application. The vendor operates it, while the customer remains responsible for its users, configuration, and entered data."
  },
  {
    concept: "public", conceptLabel: "Public cloud",
    q: "Several organizations use services from the same cloud provider, while the provider separates each organization's resources and accounts. This is an example of:",
    options: ["A private cloud", "A public cloud", "A hybrid cloud", "A local area network"], answer: 1,
    miss: "The infrastructure serves multiple customers, so it is not dedicated private cloud. A local network is not a cloud deployment model.",
    why: "Public cloud services run on provider-operated infrastructure serving multiple customers. Shared infrastructure does not mean customers share access to each other's data."
  },
  {
    concept: "private", conceptLabel: "Private cloud",
    q: "A company runs a cloud environment reserved for its own use in a provider's data center. Which deployment model does that describe?",
    options: ["Public cloud", "Private cloud", "Multi-cloud", "Software as a Service (SaaS)"], answer: 1,
    miss: "Even though the provider hosts it, the environment is reserved for one organization. SaaS is a service model and multi-cloud means using more than one provider.",
    why: "A private cloud is dedicated to one organization; it does not have to be physically located at that organization's site."
  },
  {
    concept: "hybrid", conceptLabel: "Hybrid cloud",
    q: "A hospital connects its private environment with a public cloud so different parts of a service can run in either place. What is this approach called?",
    options: ["Public cloud", "Private cloud", "Hybrid cloud", "Multi-cloud"], answer: 2,
    miss: "The key clue is connected private and public environments. Multi-cloud refers to multiple providers and does not necessarily include a private cloud.",
    why: "Hybrid cloud links private and public environments. Using two public providers without a private environment is instead called multi-cloud."
  },
  {
    concept: "shared-responsibility", conceptLabel: "Shared responsibility",
    q: "A team uses a managed cloud application. Which security task should it still expect to handle?",
    options: [
      "Replacing the provider's physical disks",
      "Patching the provider's data-center network",
      "Managing who can sign in and what data users can access",
      "Maintaining the application's source code for the vendor"
    ], answer: 2,
    miss: "The other choices assign provider infrastructure tasks to the customer or incorrectly assume the provider maintains the customer's identities and access.",
    why: "Even when a provider operates the application and infrastructure, customers must manage identities, access, and their data appropriately."
  }
];

export { PRETEST_QUIZ, POSTTEST_QUIZ };

export const LESSONS = [
  {
    id: "what-is-cloud", title: "Cloud computing: the foundations", minutes: 5,
    sourceIds: ["nist", "aws-models", "google-cloud"],
    objectives: [
      "Explain cloud computing in your own words.",
      "Recognize on-demand access, flexible capacity, and usage-based costs.",
      "Distinguish a service model from a deployment model."
    ],
    body: [
      { h: "Computing as a service", p: "Cloud computing is on-demand access to computing resources—such as servers, storage, databases, networking, and software—over a network. Instead of buying and operating every machine yourself, you use services operated by a cloud provider." },
      { h: "Why organizations use it", p: "Teams can provision resources quickly, scale capacity up or down, and avoid some upfront hardware purchases. Cloud is not automatically cheaper: usage, data transfer, support, and unused resources can all affect the bill. A good habit is to estimate, monitor, and turn off what you do not need." },
      { h: "Two different questions", p: "A service model asks what the provider manages: infrastructure, a development platform, or finished software. A deployment model asks who the environment is for and how it is arranged: public, private, or a combination in hybrid cloud. Keep these questions separate; for example, a SaaS application can be delivered through a public cloud." }
    ],
    check: {
      q: "Which statement best describes cloud computing?",
      options: ["Buying and maintaining every server before using it", "Getting computing resources on demand from a provider over a network", "Using only files saved on one personal computer", "Any application that has a web page"],
      answer: 1,
      why: "Cloud computing provides on-demand access to provider-operated computing resources over a network. A web page alone does not make an application cloud computing."
    }
  },
  {
    id: "service-models", title: "Service models: Infrastructure, Platform, and Software as a Service", minutes: 8,
    sourceIds: ["nist", "aws-models", "shared-responsibility"],
    objectives: [
      "Compare what the customer and provider manage in Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).",
      "Choose a service model from a team's needs for control or convenience.",
      "Apply the shared-responsibility idea to security and maintenance."
    ],
    body: [
      { h: "One stack, different responsibility lines", p: "Every application depends on layers such as networking, storage, servers, an operating system, runtime, data, and application code. The service model changes which layers the provider operates. The customer remains responsible for using the service safely, especially managing identities and data." },
      { stack: true },
      { h: "IaaS: control over virtual infrastructure", p: "With Infrastructure as a Service, you rent building blocks such as virtual machines, storage, and networks. You typically configure the operating system, install software, and maintain what you put on the machine. Choose IaaS when you need that control and are prepared to operate it." },
      { h: "PaaS: focus on your application", p: "With Platform as a Service, the provider operates the infrastructure and application platform. Your team focuses on its code, configuration, and data. This can reduce routine server work, but you still need to secure and maintain your application." },
      { h: "SaaS: use a finished application", p: "With Software as a Service, the provider operates a complete application, such as hosted email or online collaboration software. You configure the service, manage users and access, and take care with your content; you generally do not maintain the application's servers or code." },
      { h: "A quick decision aid", p: "Need operating-system control? Consider Infrastructure as a Service (IaaS). Want to deploy your own code without managing the platform? Consider Platform as a Service (PaaS). Need a ready-made application? Consider Software as a Service (SaaS). These are trade-offs, not rankings: more provider management usually means less low-level control." }
    ],
    check: {
      q: "A team writes its own application but wants the provider to manage the operating system and runtime. Which service model is the best fit?",
        options: ["Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Software as a Service (SaaS)", "Private cloud"],
      answer: 1,
      why: "Platform as a Service (PaaS) manages the platform, including the operating system and runtime, while the team remains responsible for its application and data."
    }
  },
  {
    id: "deployment-models", title: "Deployment models: public, private, and hybrid cloud", minutes: 7,
    sourceIds: ["nist", "aws-models", "google-cloud"],
    objectives: [
      "Describe public and private cloud in terms of who uses the infrastructure.",
      "Identify a hybrid cloud and distinguish it from multi-cloud.",
      "Avoid assuming that a deployment model alone guarantees security or compliance."
    ],
    body: [
      { h: "Public cloud", p: "A cloud provider operates infrastructure and offers services to multiple customers. Customers share underlying infrastructure while the provider uses logical controls to separate resources. Public does not mean that your data is openly visible or that the service is free." },
      { h: "Private cloud", p: "A private cloud environment is dedicated to one organization. It can be located in that organization's own facility or hosted by a provider. A private cloud can offer more direct control, but the organization still needs to manage cost, security, and operations." },
      { h: "Hybrid cloud", p: "Hybrid cloud connects private and public cloud environments so an organization can use both together. For example, a company might keep one system in a private environment and connect it to a public-cloud service. The integration, identity, networking, and data movement need deliberate design." },
      { h: "Multi-cloud is different", p: "Multi-cloud means using services from multiple cloud providers. It can involve more than one public provider and does not require a private cloud. An organization can use both hybrid and multi-cloud, but the terms describe different aspects of its setup." },
      { h: "Choose based on requirements", p: "Consider data location, regulations, existing systems, team skills, availability, and total cost. No deployment model is automatically the most secure or least expensive; the result depends on the design and how it is operated." }
    ],
    check: {
      q: "A company uses a private environment for one workload and connects it to a public cloud for another. Which term describes the arrangement?",
      options: ["Public cloud", "Private cloud", "Hybrid cloud", "Software as a Service (SaaS)"],
      answer: 2,
      why: "Hybrid cloud combines connected private and public environments. Multi-cloud would mean using multiple providers and does not, by itself, imply a private environment."
    }
  },
  {
    id: "cloud-decisions", title: "Making responsible cloud decisions", minutes: 6,
    sourceIds: ["shared-responsibility", "aws-models"],
    objectives: [
      "Identify customer responsibilities that remain in every service model.",
      "Name practical cost, security, and reliability considerations.",
      "Select a cloud approach based on requirements rather than assumptions."
    ],
    body: [
      { h: "Security is shared", p: "Providers protect the cloud infrastructure they operate. Customers still need to protect their accounts, choose appropriate access, configure their services, and handle their data responsibly. The division depends on the service: customers generally manage more in IaaS and less of the underlying stack in SaaS." },
      { h: "Plan for reliability", p: "A cloud provider can offer resilient services, but an application is not automatically reliable just because it runs in the cloud. Teams should identify what must stay available, plan for backups and recovery, and test the way the application handles failures." },
      { h: "Keep an eye on cost", p: "Pay-as-you-go can reduce upfront spending, but resources left running, storage growth, and data transfer can add cost. Set budgets or alerts where available, review usage, and select capacity that fits the workload." },
      { h: "Use a requirement-led checklist", p: "Before choosing a service, ask: What does the team need to build or use? How much control does it need? Who will maintain it? What rules apply to the data? What availability is required? How will access, recovery, and cost be managed? The best choice is the one that fits these constraints." }
    ],
    check: {
      q: "A team moves an application to a cloud provider. Which action remains the team's responsibility?",
      options: ["Physically secure the provider's data center", "Manage user access to its application and data", "Replace the provider's network hardware", "Guarantee that the provider's power never fails"],
      answer: 1,
      why: "Customers remain responsible for their identities, access, and data. The provider operates and protects the underlying cloud infrastructure."
    }
  }
];

export const SCENARIOS = [
  {
    id: "s1", concept: "Service models", text: "A small team has its own web application code. It wants to deploy often, but does not have staff to patch operating systems or manage servers.",
    options: ["Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Software as a Service (SaaS)"], answer: 1,
    miss: "Separate the team's need to build its own application from its wish not to operate the underlying platform.",
    why: "Platform as a Service (PaaS) lets the team deploy its application while the provider manages the operating system, runtime, and infrastructure."
  },
  {
    id: "s2", concept: "Service models", text: "A company must run an older program that needs a specific operating-system version and custom machine settings.",
    options: ["Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Software as a Service (SaaS)"], answer: 0,
    miss: "The key requirement is control over the virtual machine's operating system.",
    why: "Infrastructure as a Service (IaaS) provides virtual machines that the company can configure and maintain. It also means the company takes on more operating work."
  },
  {
    id: "s3", concept: "Service models", text: "A community organization needs hosted email and shared calendars. It wants to configure users but not build or maintain the software.",
    options: ["Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Software as a Service (SaaS)"], answer: 2,
    miss: "They want to use a finished application rather than deploy their own code.",
    why: "Software as a Service (SaaS) provides ready-to-use software operated by the provider. The organization still manages users, settings, and its information."
  },
  {
    id: "s4", concept: "Deployment models", text: "A bank has a dedicated private cloud for one system and connects it to public-cloud services used by another part of the business.",
    options: ["Public cloud", "Private cloud", "Hybrid cloud", "Multi-cloud only"], answer: 2,
    miss: "Look for the combination and connection of private and public environments.",
    why: "Hybrid cloud combines private and public environments. Multi-cloud refers to using multiple providers and does not necessarily include a private cloud."
  },
  {
    id: "s5", concept: "Deployment models", text: "A retailer uses two different public-cloud providers for separate services. It has no private cloud.",
    options: ["Public cloud only", "Private cloud", "Hybrid cloud", "Multi-cloud"], answer: 3,
    miss: "The clue is the use of more than one provider, with no private environment.",
    why: "Using services from multiple providers is multi-cloud. Hybrid cloud specifically combines private and public environments."
  },
  {
    id: "s6", concept: "Cloud fundamentals", text: "A research team wants to experiment this afternoon without buying hardware. It can increase or reduce its computing capacity as its experiment changes.",
    options: ["Cloud computing", "Private cloud is required", "Software as a Service (SaaS) only", "A fixed-capacity server room"], answer: 0,
    miss: "Look for on-demand access and flexible capacity without an upfront hardware purchase.",
    why: "Cloud services can provide on-demand resources that teams can scale to fit changing workloads."
  },
  {
    id: "s7", concept: "Shared responsibility", text: "A department subscribes to a cloud document application. Which task should it still plan to do?",
    options: ["Patch the provider's application servers", "Manage employee accounts and document access", "Maintain the provider's storage hardware", "Install the provider's operating system updates"], answer: 1,
    miss: "Even when the vendor operates the application, the customer remains responsible for its users and access choices.",
    why: "With SaaS, the provider manages the application and infrastructure, but the department still manages its users, access, and information."
  },
  {
    id: "s8", concept: "Cloud decisions", text: "A startup is comparing cloud options. Its monthly bill is growing because test machines remain on after experiments finish.",
    options: ["Move every workload to a private cloud immediately", "Review usage and shut down resources that are no longer needed", "Assume the provider will stop billing automatically", "Switch from Platform as a Service (PaaS) to Software as a Service (SaaS) regardless of requirements"], answer: 1,
    miss: "The problem is unused capacity, so start by examining resource usage and lifecycle.",
    why: "Cloud usage is often metered. Reviewing resources, budgets, and alerts helps control costs; changing deployment models without assessing requirements may not solve the issue."
  }
];

export const REFLECTION_PROMPTS = {
  learned: "What is one cloud concept you understand better now than before the course?",
  confusing: "What is still unclear, or what would you like another example of?",
  ratings: "Rate each item from 1 (poor) to 5 (excellent)."
};
