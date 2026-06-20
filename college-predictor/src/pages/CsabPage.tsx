import { PredictorPage } from '../components/PredictorPage';
import { EXAM_CONFIGS } from '../lib/exam-config';

function CsabPage() {
  return <PredictorPage config={EXAM_CONFIGS.csab} />;
}

export { CsabPage };
