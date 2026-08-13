import { Button, Card, Col, Empty, Progress, Row, Tag, Typography } from "antd";

import { useLocation, useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

function ResultsPage() {
  const location = useLocation();

  const navigate = useNavigate();

  let result = location.state?.result;

  if (!result) {
    const storedResult = sessionStorage.getItem("assessmentResult");

    if (storedResult) {
      result = JSON.parse(storedResult);
    }
  }

  if (!result) {
    return (
      <div className="page-container">
        <Empty description="No assessment result found">
          <Button type="primary" onClick={() => navigate("/")}>
            Go to Dashboard
          </Button>
        </Empty>
      </div>
    );
  }

  const { candidate, assessment, skillScores, skillGaps } = result;

  return (
    <div className="page-container">
      <div className="results-header">
        <Text className="brand">SkillGraph</Text>

        <Title>Assessment Results</Title>

        <Paragraph>
          {candidate.name}, here is your current developer skill profile.
        </Paragraph>
      </div>

      <Card className="score-card">
        <Row align="middle" gutter={[30, 30]}>
          <Col>
            <Progress type="circle" percent={assessment.overallScore} />
          </Col>

          <Col>
            <Title level={3}>Overall Score</Title>

            <Text>
              {assessment.correctAnswers} of {assessment.totalQuestions} answers
              correct
            </Text>
          </Col>
        </Row>
      </Card>

      <Title level={3} className="section-title">
        Skill Breakdown
      </Title>

      <Row gutter={[16, 16]}>
        {skillScores.map((skill) => (
          <Col xs={24} sm={12} lg={8} key={skill.skillId}>
            <Card>
              <div className="skill-card-header">
                <Text strong>{skill.skillName}</Text>

                <Tag>{skill.score}%</Tag>
              </div>

              <Progress percent={skill.score} showInfo={false} />

              <Text type="secondary">
                {skill.correct}/{skill.total} correct
              </Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={3} className="section-title">
        Skill Gaps
      </Title>

      {skillGaps.length === 0 ? (
        <Card>
          <Empty description="No major skill gaps detected" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {skillGaps.map((gap) => (
            <Col xs={24} md={12} key={gap.id}>
              <Card>
                <div className="skill-card-header">
                  <Title level={4}>{gap.name}</Title>

                  <Tag color="warning">{gap.score}%</Tag>
                </div>

                {gap.impacts.length > 0 ? (
                  <>
                    <Paragraph>
                      Improving this skill can also help with:
                    </Paragraph>

                    {gap.impacts.map((impact) => (
                      <Tag key={impact.id}>
                        {impact.name} · {impact.distance} hop
                      </Tag>
                    ))}
                  </>
                ) : (
                  <Text type="secondary">No dependent skills found.</Text>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Button
        type="primary"
        size="large"
        className="restart-button"
        onClick={() => {
          sessionStorage.removeItem("assessmentResult");

          navigate("/");
        }}
      >
        Take Assessment Again
      </Button>
    </div>
  );
}

export default ResultsPage;
