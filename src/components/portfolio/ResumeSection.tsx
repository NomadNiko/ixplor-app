import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

interface ExperienceCardProps {
  period: string;
  role: string;
  company?: string;
  description: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  period,
  role, 
  company,
  description
}) => (
  <Card sx={{ 
    mb: 3,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0, 
      bottom: 0,
      width: 4,
      bgcolor: 'primary.main',
      borderTopLeftRadius: 1,
      borderBottomLeftRadius: 1
    }
  }}>
    <CardContent>
      <Typography variant="overline" color="text.secondary" gutterBottom>
        {period}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {role}
      </Typography>
      {company && (
        <Typography color="text.secondary" gutterBottom>
          {company}
        </Typography>
      )}
      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
        {description}
      </Typography>
    </CardContent>
  </Card>
);


export default function ResumeSection() {
  const experiences = [
    {
      period: "Jun 2017 - Oct 2019",
      role: "Lead Site Operations Engineer",
      company: "SigFig/WikiInvest Inc.",
      description: `
As the Lead Site Operations Engineer at SigFig/WikiInvest Inc., I spearheaded a team of six engineers, focusing on maintaining and enhancing the reliability, performance, and security of our production and development environments. My leadership responsibilities included team mentorship, workload distribution, and strategic planning to optimize site operations.

Key Contributions:

   Team Leadership & Mentorship: I effectively managed and mentored a team of six Site Operations Engineers, fostering a collaborative and high-performance team environment. This involved setting clear objectives, providing technical guidance, and conducting performance reviews to ensure team members were aligned with company goals and equipped for success.
-   Linux Server Administration (Red Hat):  I was directly responsible for the administration of critical infrastructure Red Hat Enterprise Linux servers. This included proactive monitoring, performance tuning, security hardening, and ensuring high availability for all essential services. My expertise in Red Hat Linux was crucial in maintaining a stable and robust server environment.
-   Configuration Management with Puppet: I implemented and managed system configurations using Puppet, adopting an infrastructure-as-code approach. This automation was vital for consistent and efficient server deployments, updates, and configuration changes across our infrastructure, significantly reducing manual errors and improving deployment speed.
-   System Monitoring & Alerting (Nagios, New Relic, Runscope): I established and oversaw comprehensive system monitoring using a suite of tools including Nagios, New Relic, and Runscope. This proactive monitoring strategy allowed for the early detection of system anomalies and performance bottlenecks, enabling rapid response and minimizing potential service disruptions. I configured alerts and dashboards to provide real-time insights into system health and application performance.
-   Source Code Management (Git, Gerrit):  I managed source code using Git and Gerrit, enforcing version control best practices within the team. I implemented efficient branching strategies, managed code merges, and utilized Gerrit for code reviews to ensure code quality and facilitate seamless collaborative development workflows.
-   Java Application Log Management (ELK Stack, Splunk): I took charge of managing and analyzing Java application logs using the ELK Stack (Elasticsearch, Logstash, Kibana) and Splunk. By centralizing and analyzing logs, I provided actionable insights into application behavior, system performance, and potential issues. This was instrumental in troubleshooting complex application problems and optimizing performance.

My role was critical in ensuring the continuous operation and scalability of SigFig/WikiInvest's infrastructure, directly supporting the company's ability to deliver reliable and high-performance financial services.
      `
    },
    {
      period: "Oct 2015 - May 2017",
      role: "Associate DevOps Engineer / Cloud Engineer",
      company: "Bottomline Technologies",
      description: `
As an Associate DevOps Engineer / Cloud Engineer at Bottomline Technologies, I played a pivotal role in managing and optimizing both virtual and physical server infrastructure supporting critical digital banking applications. My responsibilities spanned across various operating systems, virtualization technologies, and automation tools, contributing to the efficiency and reliability of our DevOps and cloud operations.

Key Responsibilities and Accomplishments:

-   Virtual and Physical Server Farm Administration (VMware vSphere): I administered extensive virtual and physical server farms using VMware vSphere. This involved virtual machine provisioning, resource management, performance monitoring, and ensuring high availability across the VMware environment. My efforts were key to optimizing resource utilization and maintaining a robust virtual infrastructure.
-   Multi-OS Server Management (Red Hat Linux, CentOS, AIX, Sun Solaris): I managed a heterogeneous server environment comprising Red Hat Linux, CentOS, AIX, and Sun Solaris. This required a broad skillset in system administration across different Unix-based platforms, including system configuration, security, and performance tuning tailored to each OS.
-   Jenkins Administration for CI/CD: I was responsible for administering Jenkins, a critical component of our Continuous Integration and Continuous Delivery (CI/CD) pipeline. My tasks included configuring Jenkins master/slave architectures, performing system upgrades, and creating and maintaining automated job configurations. This streamlined our software release processes and enhanced deployment frequency and reliability.
-   Configuration Management with Puppet: I implemented and managed system configurations using Puppet, which was essential for maintaining infrastructure as code. This automation ensured consistency across our server environments, simplified compliance management, and facilitated rapid and repeatable deployments.
-   System Monitoring and Performance Analysis (Nagios, OEM, Lansweeper Scanner): I utilized Nagios, Oracle Enterprise Manager (OEM), and Lansweeper Scanner to monitor system health and performance. This proactive monitoring enabled me to identify and address potential issues, ensuring optimal system uptime and performance. I configured monitoring parameters and alerts to maintain system stability and responsiveness.
-   Source Code Management across Multiple Systems (Git, Stash, CollabNet SVN, Wush.net SVN): I managed source code using a variety of version control systems, including Git, Stash, CollabNet SVN, and Wush.net SVN. This required adaptability and proficiency across different VCS platforms, ensuring effective version control practices were followed across various projects and teams.
-   Production Releases and Upgrades of Digital Banking Applications (Jenkins): I played a crucial role in executing production releases and upgrades of digital banking applications using Jenkins. This involved coordinating deployments, managing release schedules, and ensuring smooth and reliable application updates with minimal downtime.
-   SFTP Automation with GoAnywhere MFT: I administered SFTP automation using GoAnywhere MFT, enhancing our secure file transfer capabilities. This involved setting up automated file transfer workflows, managing security protocols, and ensuring reliable data exchange processes.
-   Java Application Installation and Configuration (WebLogic, WLST): I installed, configured, and managed Java applications on WebLogic Server, leveraging WebLogic Scripting Tool (WLST) for automation. This expertise was vital for efficient application deployment, configuration management, and operational tasks within the WebLogic environment.
-   Database Administration (Oracle, MySQL): I performed database administration tasks for both Oracle and MySQL databases. This included database maintenance, performance tuning, backup and recovery operations, and ensuring data integrity and availability for our applications.
-   Scripting and Automation (Bash, PowerShell, Capistrano, Python): I developed and maintained scripts using Bash, PowerShell, Capistrano, and Python to automate a wide range of tasks, from application configurations to system administration and deployment processes. These scripts significantly improved efficiency and reduced manual effort in routine operations.
-   Application Pod/Stack Provisioning (CloudBolt, PowerCLI): I provisioned application pods and stacks using CloudBolt and PowerCLI, automating infrastructure deployments in cloud and virtualized environments. This automation was key to rapidly scaling resources and deploying applications efficiently.

Through these diverse responsibilities, I significantly contributed to the agility and efficiency of Bottomline Technologies' DevOps practices, ensuring robust and scalable infrastructure support for critical digital banking services.
      `
    },
    {
      period: "Apr 2013 - Oct 2015",
      role: "Service Desk Analyst / Helpdesk Technician / Operations Analyst / Jr. Linux Administrator",
      company: "Andera (now Bottomline)",
      description: `
In my multifaceted role at Andera (now Bottomline), I served as a Service Desk Analyst, Helpdesk Technician, Operations Analyst, and Jr. Linux Administrator. This position provided a broad spectrum of responsibilities, from end-user support to system administration and vendor management, laying a strong foundation in IT operations.

Key Responsibilities and Contributions:

-   Laptop Build Out, Imaging, and Deployment: I was responsible for the complete lifecycle of laptop deployments, including building out new laptops, performing system imaging for standardized configurations, and deploying them to end-users. This ensured that all employees had properly configured and secure systems from day one.
-   Trouble Ticket Triage and Administration: I efficiently managed and triaged incoming trouble tickets, categorizing issues, prioritizing based on severity, and assigning them to appropriate technical teams. This process ensured timely responses and resolutions, maintaining operational efficiency and user satisfaction.
-   SAAS Application Management (Third-Party & Internal): I managed both third-party outsourced SAAS applications and internal SAAS systems. This involved user administration, system configuration, monitoring application health, and ensuring seamless operation and accessibility for all users.
-   ShoreTel Phone System Administration: I administered the ShoreTel phone system, managing user accounts, configuring phone settings, and troubleshooting communication issues. This ensured reliable and effective communication systems for the entire organization.
-   System Administration Tasks: I performed a variety of system administration tasks across different platforms, ensuring system stability, security, and optimal performance. This included user account management, system maintenance, and basic troubleshooting across various systems.
-   Door Card System Administration: I managed the door card system administration, overseeing physical access controls. This involved managing user access permissions, maintaining system security, and resolving any access-related issues.
-   Subversion Server Management (Internal and External): I managed Subversion servers, both internal and external facing, ensuring the integrity and availability of code repositories. This included user access control, repository maintenance, and basic troubleshooting.
-   Asset Management: I conducted comprehensive asset management, meticulously tracking IT inventory, including both hardware and software assets. This ensured accurate record-keeping, efficient resource allocation, and compliance with software licensing agreements.
-   Vendor Management: I managed relationships with various IT vendors, overseeing service delivery, managing contracts, and ensuring cost-effective solutions. This role involved vendor coordination for IT services and product procurement.
-   Laptop Encryption Administration: I administered laptop encryption solutions to secure company data, ensuring compliance with security policies and protecting sensitive information against unauthorized access.
-   SSL Certificate and Keystore Management: I installed and managed SSL certificates and keystores for SAAS custom URL branding. This was crucial for ensuring secure, branded customer experiences and maintaining trust through secure web access.
-   Red Hat Linux Server Administration: I administered Red Hat Linux servers, performing basic system administration tasks, maintenance, and troubleshooting. This experience was foundational for my subsequent roles focusing on Linux environments.
-   Customer Issue Troubleshooting within SLAs: I consistently troubleshoot customer issues within defined Service Level Agreements (SLAs), ensuring timely and effective resolutions. This focus on SLA adherence was critical for maintaining customer satisfaction and meeting service delivery metrics.
-   Limited Exposure to MySQL: I gained initial exposure to MySQL database administration, performing basic tasks and developing a foundational understanding of database management principles.

This diverse role at Andera provided me with a broad skill set in IT operations, customer support, and system administration, preparing me for more specialized roles in DevOps and Site Operations engineering.
      `
    },
    {
      period: "May 2011 - Nov 2012",
      role: "System Support Analyst",
      company: "CVS Pharmacies Inc.",
      description: `
As a System Support Analyst at CVS Pharmacies Inc., I was at the forefront of providing technical assistance to CVS personnel across the United States. My primary responsibility was to deliver efficient and effective support, ensuring minimal disruption to CVS operations and maintaining high levels of user satisfaction.

Key Responsibilities and Achievements:

-   First-Level System Support: I served as the first point of contact for CVS personnel nationwide, answering incoming support calls and addressing a wide array of system-related issues. This required a broad understanding of CVS systems and the ability to quickly diagnose and respond to diverse technical problems.
-   Customer Issue Troubleshooting within SLAs: I was responsible for troubleshooting customer issues within defined Service Level Agreements (SLAs). My focus was on providing rapid and effective solutions, aiming for first-call resolution whenever possible to meet and exceed service delivery targets.
-   Issue Escalation: When issues could not be resolved at the first level, I efficiently escalated them to specialized teams. This involved accurate documentation of problems, initial troubleshooting steps taken, and clear communication of issue details to ensure smooth and effective escalation and resolution processes.

In this role, I honed my skills in customer service, technical troubleshooting, and effective communication, contributing to the smooth operation of CVS Pharmacy systems and ensuring timely support for all CVS personnel.
      `
    },
    {
      period: "Sep 2006 - Apr 2011",
      role: "Cyber System Operations",
      company: "United States Air Force",
      description: `
During my tenure in Cyber System Operations with the United States Air Force, I gained comprehensive experience across various critical IT functions, serving in roles that spanned system administration, on-site technical support, and help desk/NOC operations. This service provided a robust foundation in IT infrastructure management, security protocols, and technical support in high-stakes environments.

Key Roles and Experiences:

-   System Administrator within Configuration Management (1 Year): For one year, I served as a System Administrator specializing in configuration management. In this capacity, I was responsible for managing and maintaining systems within a strict configuration management framework. This involved ensuring system compliance with security standards, implementing configuration changes in a controlled and auditable manner, and maintaining system consistency across the infrastructure. My work was crucial in upholding system integrity and security within a highly regulated environment.
-   On-Site Technical Support (1 Year): I dedicated a year to providing direct, on-site technical support to end-users. This role required hands-on troubleshooting of hardware and software issues, system setup and maintenance, and rapid problem resolution to ensure operational readiness. My on-site support was vital for maintaining user productivity and system uptime in demanding operational settings.
-   Help Desk/NOC Technical Support (2 ½ Years): For two and a half years, I operated in Help Desk and Network Operations Center (NOC) technical support roles. In these positions, I was responsible for monitoring network and system performance, responding to system alerts, and providing remote technical troubleshooting and resolution. This involved using monitoring tools to detect and diagnose issues, performing initial triage, and escalating complex problems as needed. My work in the NOC was essential for maintaining continuous system availability and network stability.

My service in the Air Force Cyber System Operations provided me with invaluable experience in managing complex IT systems, adhering to stringent security protocols, and delivering technical support in mission-critical environments. These experiences have shaped my approach to IT operations, emphasizing proactive management, robust security practices, and effective problem-solving.
      `
    }
  ];

  const skills = [
    {
      category: "Web Development",
      items: ["React", "Node.js", "Next.js", "REST APIs", "MongoDB"]
    },
    {
      category: "Programming",
      items: ["JavaScript", "TypeScript", "Python", "C#", "Bash"]
    },
    {
      category: "Scripting & Automation",
      items: ["JavaScript", "Python", "Bash", "PowerShell", "REST APIs", "Ansible", "Puppet",  "CloudBolt", "PowerCLI", "Capistrano", "GoAnywhere MFT", "WLST"]
    },
    {
      category: "Troubleshooting & Technical Support",
      items: ["Customer Issue Resolution", "Ticket Triage", "Help Desk Support", "On-site Support"]
    },
      {
      category: "Application Management",
      items: ["SaaS Applications", "Digital Banking Apps", "Jenkins", "Java Applications", "ELK Stack", "Splunk"]
    },
      {
      category: "Source Control",
      items: ["Git", "Gerrit", "SVN"]
    },
    {
      category: "Database Administration",
      items: ["MySQL DBA", "Oracle DBA"]
    },
    {
      category: "Application Servers",
      items: ["Apache Tomcat", "WebLogic"]
    },
    {
      category: "System Monitoring",
      items: ["New Relic", "Nagios", "Runscope", "Rackspace Monitoring", "OEM"]
    },
      {
      category: "Configuration Management",
      items: ["Ansible", "Puppet"]
    },
    {
      category: "Server Administration",
      items: ["Linux Server Admin", "VMware Virtualization", "Server Farm Admin"]
    },
    {
      category: "Operating Systems",
      items: ["Linux (Ubuntu)", "Linux (CentOS)", "Linux (Red Hat)", "Windows Server", "Sun Solaris", "AIX"]
    },
      {
      category: "Management & Administration",
      items: ["Team Management", "Vendor Management", "Asset Management"]
    },
    {
      category: "Game Development",
      items: ["Unity", "C#", "Game Design", "3D Modeling", "Asset Creation"]
    },
    {
      category: "Other Skills",
      items: ["SAAS Administration", "SSL Certificates", "Keystores", "MySQL (Limited)", "Laptop Deployment", "ShoreTel Phone Systems", "Door Card Systems"]
    }
  ];
        
  return (
    <Box>
      <Grid container spacing={4}>

      <Grid item xs={12} md={4}>
          <Box sx={{ 
            position: 'sticky',
            top: 24,
            bgcolor: 'background.paper', 
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            {skills.map((skillGroup, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {skillGroup.category}  
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {skillGroup.items.map((skill, i) => (
                    <Box
                      key={i}  
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        bgcolor: 'background.glass',
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {skill}
                    </Box>
                  ))}
                </Box>
                {index < skills.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Experience
          </Typography>
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} {...exp} />  
          ))}
        </Grid>

        
      </Grid>
    </Box>
  );
}