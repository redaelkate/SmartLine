# **SmartLine**



# SmartLine

SmartLine is an AI-powered automation platform designed to replace traditional human call center agents with intelligent AI agents. These agents can handle a wide range of business tasks, including customer support, sales, appointment scheduling, and more. Built with **Django** (backend), **React.js** (frontend), and **MySQL** (database), SmartLine is a scalable and efficient solution for businesses looking to automate their operations.

---

## Live Demo

Explore the live demo of SmartLine:  
🌐 [SmartLine Live Demo](https://test-eight-zeta-80.vercel.app/)
[video of the AI agents before the integration](https://drive.google.com/file/d/1laPzp-da437sSdDf62HsXd2tCMaSi42J/view?usp=sharing)

---

## Features

- **AI-Powered Agents**: Intelligent agents capable of handling customer interactions, sales, and support tasks.
- **Task Automation**: Automate repetitive tasks such as appointment scheduling, order tracking, and FAQs.
- **Real-Time Analytics**: Monitor agent performance, customer satisfaction, and task completion rates.
- **Customizable Workflows**: Tailor AI agents to suit specific business needs.
- **Scalable Architecture**: Built to handle businesses of all sizes, from startups to enterprises.

---

## Technologies Used

- **Backend**: Django (Python)
- **Frontend**: React.js (JavaScript)
- **Database**: MySQL
- **AI Integration**: OpenAI GPT, custom NLP models, or other AI frameworks
- **APIs**: Django REST Framework (DRF)
- **Deployment**: Vercel (Frontend), Render/Heroku/AWS (Backend)



## Prerequisites

Before running the project, ensure you have the following installed:

- Python 3.x
- Node.js and npm
- MySQL Server
- Django
- React.js

---

## Installation

### Backend (Django)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smartline.git
   cd smartline/backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up the MySQL database:
   - Create a database in MySQL.
   - Update the `settings.py` file with your database credentials:
     ```python
     DATABASES = {
         'default': {
             'ENGINE': 'django.db.backends.mysql',
             'NAME': 'your_database_name',
             'USER': 'your_database_user',
             'PASSWORD': 'your_database_password',
             'HOST': 'localhost',
             'PORT': '3306',
         }
     }
     ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver
   ```

### Frontend (React.js)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

---

## Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel. To deploy your own version:
1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy the frontend:
   ```bash
   cd frontend
   vercel
   ```

### Backend (Render/Heroku/AWS)
The backend can be deployed on platforms like Render, Heroku, or AWS. For example, to deploy on Render:
1. Create a new Web Service on Render.
2. Connect your GitHub repository.
3. Set environment variables for your database and Django settings.
4. Deploy!

---

## AI Agent Workflow

SmartLine's AI agents are designed to handle the following tasks:
1. **Customer Support**: Answer FAQs, resolve issues, and escalate complex queries.
2. **Sales**: Recommend products, process orders, and upsell/cross-sell.
3. **Appointment Scheduling**: Book, reschedule, and cancel appointments.
4. **Data Collection**: Gather customer feedback and insights for analytics.

---

## API Documentation

The Django backend uses **Swagger** for API documentation. You can access it at:  
📚 [API Docs](https://your-backend-url/swagger/)

---

## UI Documentation

The frontend is built with React.js and uses **Storybook** for component documentation. You can access it at:  
🎨 [UI Docs](https://your-frontend-url/storybook/)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Django and React.js communities for their excellent documentation.
- OpenAI for providing cutting-edge AI models.
- Vercel for seamless frontend deployment.
```

---

### **Documenting the UI**

Since you’re using AI agents, the UI likely includes dashboards, chat interfaces, and analytics panels. Here’s how you can document it:

#### **1. Key Pages**
- **Dashboard**: Overview of AI agent performance, task completion rates, and customer satisfaction.
- **Chat Interface**: Where customers interact with AI agents.
- **Analytics**: Detailed reports on agent performance, customer feedback, and task metrics.
- **Settings**: Customize AI agent behavior, workflows, and integrations.

#### **2. Tools for UI Documentation**
- Use **Storybook** to document React components.
- Use **Swagger** or **ReDoc** for API documentation.
- Use **MkDocs** or **Docusaurus** to combine all documentation into a single site.

---

### **Next Steps**
1. Let me know if you’d like to add more details about the AI agents or specific workflows.
2. Share screenshots or descriptions of the UI, and I can help you create detailed documentation.
3. If you need help setting up **Storybook** or **Swagger**, let me know!

This project sounds amazing, and I’m excited to help you make it even better! 🚀
