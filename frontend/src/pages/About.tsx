export default function About() {
	return (
	  <div className="text-gray-800">
		<h2 className="text-3xl font-bold text-orange-600 mb-4">About CloudCrafter</h2>
		<p className="text-lg leading-relaxed">
		CloudCrafter is a full-stack cloud application deployed entirely using Infrastructure as Code (IaC).

		The system consists of a React (Vite) frontend, a Node.js/Express backend, and a PostgreSQL database managed by AWS RDS. The backend is fully containerized using Docker, and the Docker image is automatically built and pushed to Amazon ECR during deployment. The containerized backend runs on AWS ECS Fargate, ensuring a fully managed, serverless compute environment. All infrastructure components, networking rules, container builds, and deployment settings are defined and automated using the AWS CDK.
		</p>
	  </div>
	);
  }
