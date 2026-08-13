import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Card,
  message,
  Progress,
  Radio,
  Space,
  Spin,
  Typography,
} from "antd";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

const { Title, Text } = Typography;

function AssessmentPage() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const candidateName = sessionStorage.getItem("candidateName");

  useEffect(() => {
    if (!candidateName) {
      navigate("/");
      return;
    }

    const loadQuestions = async () => {
      try {
        const response = await api.get("/questions");

        setQuestions(response.data.data);
      } catch (err) {
        console.error(err);

        setError("Unable to load assessment questions.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [candidateName, navigate]);

  if (loading) {
    return (
      <div className="center-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Alert type="error" showIcon message={error} />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="page-container">
        <Alert
          type="info"
          showIcon
          message="No assessment questions are available."
        />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const selectedAnswer = answers[currentQuestion.id];

  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (event) => {
    setAnswers((previous) => ({
      ...previous,

      [currentQuestion.id]: event.target.value,
    }));
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      message.warning("Select an answer before continuing.");

      return;
    }

    setCurrentIndex((previous) => previous + 1);
  };

  const handlePrevious = () => {
    setCurrentIndex((previous) => previous - 1);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      message.warning("Select an answer before submitting.");

      return;
    }

    const formattedAnswers = questions.map((question) => ({
      questionId: question.id,

      answer: answers[question.id],
    }));

    const unanswered = formattedAnswers.some((answer) => !answer.answer);

    if (unanswered) {
      message.warning("Please answer every question.");

      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/assessments", {
        candidateName,
        answers: formattedAnswers,
      });

      const result = response.data.data;

      sessionStorage.setItem("assessmentResult", JSON.stringify(result));

      navigate("/results", {
        state: {
          result,
        },
      });
    } catch (err) {
      console.error(err);

      message.error(
        err.response?.data?.message || "Unable to submit assessment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="page-container assessment-container">
      <div className="assessment-top">
        <div>
          <Text type="secondary">Developer Assessment</Text>

          <Title level={3}>
            Question {currentIndex + 1} of {questions.length}
          </Title>
        </div>

        <Text>{candidateName}</Text>
      </div>

      <Progress percent={Math.round(progress)} showInfo={false} />

      <Card className="question-card">
        <Text type="secondary">
          {currentQuestion.skill.name} · {currentQuestion.difficulty}
        </Text>

        <Title level={3} className="question-title">
          {currentQuestion.text}
        </Title>

        <Radio.Group
          value={selectedAnswer}
          onChange={handleAnswer}
          className="answer-group"
        >
          <Space direction="vertical" size={12}>
            {currentQuestion.options.map((option) => (
              <Radio key={option} value={option} className="answer-option">
                {option}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Card>

      <div className="assessment-actions">
        <Button
          size="large"
          icon={<ArrowLeftOutlined />}
          disabled={currentIndex === 0}
          onClick={handlePrevious}
        >
          Previous
        </Button>

        {!isLastQuestion ? (
          <Button type="primary" size="large" onClick={handleNext}>
            Next
            <ArrowRightOutlined />
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            loading={submitting}
            onClick={handleSubmit}
          >
            Submit Assessment
          </Button>
        )}
      </div>
    </div>
  );
}

export default AssessmentPage;
